"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, ShieldCheck, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ClientAPI from "@/app/api/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import TelrLogo from "@/components/payments/TelrLogo";
import { isClientApiError } from "@/lib/client-api-error";
import {
  clearTelrAttemptId,
  getPersistedTelrAttemptId,
  persistReservationId,
  persistTelrAttemptId,
} from "@/lib/checkout-storage";
import {
  extractTelrSeamlessPayResult,
  extractTelrSeamlessVerifyResult,
} from "@/lib/payment-api";
import {
  clearTelrFrameMount,
  initTelrSeamlessFields,
  isCustomerEmailRequiredError,
  isPaidStatus,
  isPaymentInProgressError,
  isTerminalFailureStatus,
  tryParseTelrSeamlessPayData,
  type TelrSeamlessConfig,
  type TelrSeamlessPanelState,
  type TelrSeamlessPayData,
  type TelrSeamlessVerifyData,
} from "@/lib/telr-seamless";
import { resolveTelrSeamlessConfig } from "@/lib/telr-seamless/resolve-config";
import { cn } from "@/lib/utils";

export type TelrSeamlessPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservationId: number;
  amount: number;
  currencyLabel?: string;
  locale: string;
  /**
   * Optional email from booking/guest context. Sent as `customer_email` only
   * when the backend needs it (profile has none). Never invent fake emails.
   */
  customerEmail?: string | null;
  onPaid: (meta: { paymentId?: string | null; reservationId: number }) => void;
  onHostedFallback: () => void | Promise<void>;
  onAvailabilityChange?: (available: boolean) => void;
  className?: string;
};

const VERIFY_ATTEMPTS = 10;
const VERIFY_DELAY_MS = 1500;
const TELR_FRAME_ID = "telr_frame";
const TELR_CHALLENGE_ID = "telr_iframe";

type CheckoutMethod = "card" | "apple_pay";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function detectApplePayAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const ApplePaySession = (
      window as Window & {
        ApplePaySession?: {
          canMakePayments?: () => boolean;
        };
      }
    ).ApplePaySession;
    return Boolean(ApplePaySession?.canMakePayments?.());
  } catch {
    return false;
  }
}

export default function TelrSeamlessPanel({
  open,
  onOpenChange,
  reservationId,
  amount,
  currencyLabel,
  locale,
  customerEmail,
  onPaid,
  onHostedFallback,
  onAvailabilityChange,
  className,
}: TelrSeamlessPanelProps) {
  const { t } = useTranslation("booking");

  const [state, setState] = useState<TelrSeamlessPanelState>("idle");
  const [config, setConfig] = useState<TelrSeamlessConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [challengeUrl, setChallengeUrl] = useState<string | null>(null);
  const [hostedBusy, setHostedBusy] = useState(false);
  const [needsEmail, setNeedsEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(
    () => customerEmail?.trim() || ""
  );
  const [checkoutMethod, setCheckoutMethod] = useState<CheckoutMethod>("card");
  const [applePayAvailable, setApplePayAvailable] = useState(false);

  const cardTokenRef = useRef<string | null>(null);
  const attemptIdRef = useRef<number | null>(getPersistedTelrAttemptId());
  const paymentIdRef = useRef<string | null>(null);
  const submittingRef = useRef(false);
  const mountedRef = useRef(true);

  const currency = currencyLabel || t("step5.currency");

  const locking =
    state === "processing" ||
    state === "verifying" ||
    state === "challenge" ||
    state === "paid";

  const setAvailable = useCallback(
    (available: boolean) => {
      onAvailabilityChange?.(available);
    },
    [onAvailabilityChange]
  );

  useEffect(() => {
    if (customerEmail?.trim()) {
      setEmailInput(customerEmail.trim());
    }
  }, [customerEmail]);

  useEffect(() => {
    if (!open) return;
    setApplePayAvailable(detectApplePayAvailable());
    setCheckoutMethod("card");
  }, [open]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTelrFrameMount(TELR_FRAME_ID);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      clearTelrFrameMount(TELR_FRAME_ID);
      return;
    }

    let cancelled = false;

    const boot = async () => {
      setState("loading_config");
      setError(null);
      setChallengeUrl(null);
      cardTokenRef.current = null;

      const resolved = await resolveTelrSeamlessConfig(locale);
      if (cancelled) return;

      if (!resolved) {
        setConfig(null);
        setState("unavailable");
        setAvailable(false);
        return;
      }

      setConfig(resolved);
      setState("loading_sdk");
      setAvailable(true);

      try {
        await initTelrSeamlessFields({
          config: resolved,
          onToken: (token) => {
            cardTokenRef.current = token;
            if (mountedRef.current) {
              setError(null);
              setState((prev) =>
                prev === "loading_sdk" || prev === "idle" || prev === "ready"
                  ? "ready"
                  : prev
              );
            }
          },
        });
        if (!cancelled) {
          // If Telr did not inject fields, fall back instead of empty chrome.
          const mount = document.getElementById(TELR_FRAME_ID);
          const injected = Boolean(mount && mount.childElementCount > 0);
          if (!injected) {
            setState("unavailable");
            setAvailable(false);
            setError(t("seamless.sdkLoadFailed"));
            return;
          }
          setState("ready");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Telr Seamless SDK init failed:", err);
        setState("unavailable");
        setAvailable(false);
        setError(
          err instanceof Error ? err.message : t("seamless.sdkLoadFailed")
        );
      }
    };

    void boot();

    return () => {
      cancelled = true;
      clearTelrFrameMount(TELR_FRAME_ID);
    };
  }, [locale, open, setAvailable, t]);

  const rememberAttempt = useCallback(
    (result: TelrSeamlessPayData | TelrSeamlessVerifyData) => {
      if (result.attempt_id != null) {
        attemptIdRef.current = result.attempt_id;
        persistTelrAttemptId(result.attempt_id);
      }
      if ("payment_id" in result && result.payment_id) {
        paymentIdRef.current = result.payment_id;
      }
    },
    []
  );

  const applyVerifiedOutcome = useCallback(
    (
      verified: TelrSeamlessVerifyData
    ): "paid" | "pending" | "failed" | "cancelled" => {
      rememberAttempt(verified);
      const status = String(verified.payment_status || "").toLowerCase();

      if (isPaidStatus(status, verified.final)) {
        clearTelrAttemptId();
        setState("paid");
        onPaid({
          paymentId: verified.payment_id ?? paymentIdRef.current,
          reservationId,
        });
        return "paid";
      }

      if (verified.challenge_url) {
        setChallengeUrl(verified.challenge_url);
        setState("challenge");
        return "pending";
      }

      if (status === "cancelled") {
        setState("cancelled");
        setError(verified.message || t("paymentReturn.canceledMessage"));
        return "cancelled";
      }

      if (isTerminalFailureStatus(status)) {
        setState("failed");
        setError(verified.message || t("messages.paymentFailed"));
        return "failed";
      }

      return "pending";
    },
    [onPaid, rememberAttempt, reservationId, t]
  );

  const verifyWithBackend = useCallback(async (): Promise<
    "paid" | "pending" | "failed" | "cancelled" | "unavailable"
  > => {
    for (let i = 0; i < VERIFY_ATTEMPTS; i++) {
      try {
        const payload =
          attemptIdRef.current != null
            ? { attempt_id: attemptIdRef.current }
            : { reservation_id: reservationId };

        const response = await ClientAPI.verifyTelrSeamlessPayment(
          payload,
          locale
        );
        const verified = extractTelrSeamlessVerifyResult(response);
        const outcome = applyVerifiedOutcome(verified);
        if (outcome !== "pending") return outcome;
      } catch (err) {
        if (isClientApiError(err) && err.status === 503) {
          console.error("Seamless verify temporarily unavailable:", err.message);
        } else {
          console.error("Seamless verify failed:", err);
        }
      }

      await new Promise((r) => setTimeout(r, VERIFY_DELAY_MS));
      if (!mountedRef.current) return "pending";
    }
    return "pending";
  }, [applyVerifiedOutcome, locale, reservationId]);

  const openChallenge = useCallback((url: string) => {
    setChallengeUrl(url);
    setState("challenge");
    setError(null);
  }, []);

  const handlePayResult = useCallback(
    async (result: TelrSeamlessPayData) => {
      rememberAttempt(result);
      const status = String(result.payment_status || "").toLowerCase();

      if (isPaidStatus(status, result.final)) {
        setState("verifying");
        const outcome = await verifyWithBackend();
        if (outcome === "paid") return;
        if (outcome === "pending") {
          setState("failed");
          setError(t("paymentReturn.notPaidYet"));
        }
        return;
      }

      if (result.challenge_url || status === "challenge_required") {
        if (result.challenge_url) {
          openChallenge(result.challenge_url);
          return;
        }
        setState("verifying");
        await verifyWithBackend();
        return;
      }

      if (status === "cancelled") {
        setState("cancelled");
        setError(result.message || t("paymentReturn.canceledMessage"));
        return;
      }

      if (isTerminalFailureStatus(status)) {
        setState("failed");
        setError(result.message || t("messages.paymentFailed"));
        return;
      }

      setState("verifying");
      const outcome = await verifyWithBackend();
      if (outcome === "pending") {
        setError(t("seamless.verifyPending"));
        setState("failed");
      }
    },
    [openChallenge, rememberAttempt, t, verifyWithBackend]
  );

  const resolveCustomerEmail = useCallback((): string | undefined => {
    const fromInput = emailInput.trim();
    if (fromInput && isValidEmail(fromInput)) return fromInput;
    const fromProp = customerEmail?.trim();
    if (fromProp && isValidEmail(fromProp)) return fromProp;
    return undefined;
  }, [customerEmail, emailInput]);

  const handlePay = useCallback(async () => {
    if (submittingRef.current) return;
    if (!config) {
      toast.error(t("seamless.unavailable"));
      return;
    }

    const token = cardTokenRef.current;
    if (!token) {
      const message = t("seamless.cardIncomplete");
      setError(message);
      toast.error(message);
      return;
    }

    if (needsEmail) {
      const email = resolveCustomerEmail();
      if (!email) {
        const message = t("seamless.emailRequired");
        setError(message);
        toast.error(message);
        return;
      }
    }

    submittingRef.current = true;
    setError(null);
    setState("processing");
    persistReservationId(reservationId);

    try {
      const response = await ClientAPI.payReservationWithTelrSeamless(
        reservationId,
        token,
        locale,
        { customerEmail: resolveCustomerEmail() }
      );
      const result = extractTelrSeamlessPayResult(response);
      await handlePayResult(result);
    } catch (err) {
      if (isPaymentInProgressError(err)) {
        const body = isClientApiError(err) ? err.body : null;
        const result = tryParseTelrSeamlessPayData(body);
        if (result) {
          rememberAttempt(result);
          if (result.challenge_url) {
            openChallenge(result.challenge_url);
            toast.message(t("seamless.paymentInProgress"));
            return;
          }
          setState("verifying");
          await verifyWithBackend();
          return;
        }
      }

      if (isCustomerEmailRequiredError(err)) {
        setNeedsEmail(true);
        setState("ready");
        setError(t("seamless.emailRequired"));
        toast.error(t("seamless.emailRequired"));
        return;
      }

      console.error("Telr Seamless pay error:", err);
      const message =
        err instanceof Error ? err.message : t("messages.paymentFailed");
      setError(message);
      setState("failed");
      toast.error(message);
    } finally {
      submittingRef.current = false;
    }
  }, [
    config,
    handlePayResult,
    locale,
    needsEmail,
    openChallenge,
    rememberAttempt,
    reservationId,
    resolveCustomerEmail,
    t,
    verifyWithBackend,
  ]);

  useEffect(() => {
    if (state !== "challenge" || !challengeUrl) return;

    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;
      const type = String((data as { type?: string }).type || "").toLowerCase();
      if (
        type.includes("telr") ||
        type.includes("payment") ||
        type.includes("auth")
      ) {
        void (async () => {
          setState("verifying");
          await verifyWithBackend();
        })();
      }
    };

    const interval = window.setInterval(() => {
      if (!mountedRef.current || submittingRef.current) return;
      void (async () => {
        try {
          const payload =
            attemptIdRef.current != null
              ? { attempt_id: attemptIdRef.current }
              : { reservation_id: reservationId };
          const response = await ClientAPI.verifyTelrSeamlessPayment(
            payload,
            locale
          );
          const verified = extractTelrSeamlessVerifyResult(response);
          const status = String(verified.payment_status || "").toLowerCase();
          if (
            isPaidStatus(status, verified.final) ||
            isTerminalFailureStatus(status)
          ) {
            window.clearInterval(interval);
            setState("verifying");
            applyVerifiedOutcome(verified);
          }
        } catch {
          // Ignore transient verify errors while challenge is open.
        }
      })();
    }, 4000);

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearInterval(interval);
    };
  }, [
    applyVerifiedOutcome,
    challengeUrl,
    locale,
    reservationId,
    state,
    verifyWithBackend,
  ]);

  const handleHostedFallback = async () => {
    if (hostedBusy) return;
    setHostedBusy(true);
    try {
      onOpenChange(false);
      await onHostedFallback();
    } finally {
      setHostedBusy(false);
    }
  };

  const handleVerifyNow = async () => {
    setState("verifying");
    setError(null);
    const outcome = await verifyWithBackend();
    if (outcome === "pending") {
      setState(challengeUrl ? "challenge" : "failed");
      setError(t("seamless.verifyPending"));
    }
  };

  const isChallenge = state === "challenge" && Boolean(challengeUrl);
  const showCardMount =
    state !== "unavailable" && !isChallenge && checkoutMethod === "card";
  const showCardActions =
    checkoutMethod === "card" &&
    !isChallenge &&
    state !== "paid" &&
    state !== "loading_config" &&
    state !== "loading_sdk" &&
    state !== "unavailable";
  const showAppleOption = applePayAvailable;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // `locking` already excludes "failed"; allow dismiss only when paid.
        if (!next && locking && state !== "paid") {
          return;
        }
        onOpenChange(next);
      }}
    >
      <DialogContent
        showCloseButton={!locking || state === "paid"}
        overlayClassName="z-[1200] bg-[#0b1a45]/55 backdrop-blur-[2px]"
        className={cn(
          // Compact no-scroll sheet (challenge mode may grow). Above site header z-1000.
          "fixed inset-x-0 bottom-0 top-auto z-[1200] flex w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-t-2xl border-[#d7e4f8] bg-transparent p-0 shadow-[0_-12px_40px_rgba(20,48,135,0.22)] duration-300",
          "data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4",
          "sm:inset-auto sm:top-[50%] sm:bottom-auto sm:left-[50%] sm:max-w-[360px] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl sm:shadow-[0_20px_50px_rgba(20,48,135,0.24)] sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=closed]:slide-out-to-bottom-0",
          "[&_[data-slot=dialog-close]]:top-2.5 [&_[data-slot=dialog-close]]:end-2.5 [&_[data-slot=dialog-close]]:start-auto [&_[data-slot=dialog-close]]:right-auto [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:bg-white/15 [&_[data-slot=dialog-close]]:p-1 [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:opacity-100 [&_[data-slot=dialog-close]]:hover:bg-white/25",
          isChallenge && "sm:max-w-[480px]",
          className
        )}
      >
        <div className="relative flex flex-col overflow-hidden bg-[#f7faff] sm:rounded-2xl">
          <div
            aria-hidden
            className="mx-auto mt-1.5 h-1 w-8 shrink-0 rounded-full bg-[#c9d7ef] sm:hidden"
          />

          <header className="relative bg-[linear-gradient(145deg,#0d1f63_0%,#143087_50%,#2f6fd6_100%)] px-3 py-2.5 pe-10 text-white sm:px-3.5 sm:py-3 sm:pe-11">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <DialogTitle className="text-start text-sm font-bold tracking-tight text-white sm:text-base">
                  {t("seamless.title")}
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-start text-[11px] leading-snug text-white/75">
                  {t("seamless.subtitle")}
                </DialogDescription>
                <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-white/12 px-2 py-0.5">
                  <TelrLogo light className="gap-1 [&_span:not(.sr-only)]:text-[12px] [&_svg]:size-4" />
                </div>
              </div>
              <div className="shrink-0 rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-end">
                <p className="text-[9px] text-white/70">
                  {t("seamless.amountDue")}
                </p>
                <p className="text-sm font-bold tabular-nums leading-none text-white">
                  {amount}{" "}
                  <span className="text-[10px] font-semibold text-white/85">
                    {currency}
                  </span>
                </p>
              </div>
            </div>
          </header>

          <div className="space-y-2.5 px-3 py-2.5 sm:px-3.5 sm:py-3">
            {state !== "unavailable" &&
            !isChallenge &&
            state !== "paid" &&
            showAppleOption ? (
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    { id: "card" as const, label: t("seamless.methodCard") },
                    {
                      id: "apple_pay" as const,
                      label: t("seamless.methodApplePay"),
                    },
                  ] as const
                ).map((method) => {
                  const active = checkoutMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setCheckoutMethod(method.id)}
                      className={cn(
                        "inline-flex h-8 items-center justify-center rounded-lg border px-2 text-xs font-semibold transition",
                        active
                          ? "border-[#143087] bg-[#143087] text-white"
                          : "border-[#d7e4f8] bg-white text-[#143087]"
                      )}
                    >
                      {method.label}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {state === "unavailable" ? (
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/90 p-2.5 text-amber-950">
                <p className="text-xs font-semibold">
                  {t("seamless.unavailable")}
                </p>
                <p className="mt-0.5 text-[11px] opacity-90">
                  {t("seamless.useHostedHint")}
                </p>
              </div>
            ) : (
              <>
                {checkoutMethod === "card" ? (
                  <p className="flex items-center gap-1.5 text-[11px] text-[#5b6b86]">
                    <ShieldCheck className="size-3.5 shrink-0 text-[#62a0f6]" />
                    <span className="truncate">{t("seamless.lockHint")}</span>
                  </p>
                ) : null}

                {checkoutMethod === "apple_pay" ? (
                  <p className="rounded-lg border border-[#dbe7f8] bg-white px-2.5 py-2 text-[11px] text-[#334155]">
                    {t("seamless.methodAppleHint")}
                  </p>
                ) : null}

                {needsEmail &&
                checkoutMethod === "card" &&
                state !== "challenge" &&
                state !== "paid" ? (
                  <input
                    id="telr-customer-email"
                    type="email"
                    autoComplete="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder={t("seamless.emailPlaceholder")}
                    aria-label={t("seamless.emailLabel")}
                    className="h-9 w-full rounded-lg border border-[#d7e4f8] bg-white px-3 text-sm outline-none focus:border-[#62a0f6] focus:ring-2 focus:ring-[#62a0f6]/15"
                  />
                ) : null}

                <div
                  className={cn(
                    "relative overflow-hidden rounded-xl border border-[#d7e4f8] bg-white",
                    !showCardMount && "hidden"
                  )}
                >
                  <div
                    id={TELR_FRAME_ID}
                    className="min-h-[88px] w-full bg-white p-2 sm:min-h-[96px] sm:p-2.5"
                    aria-label={t("seamless.cardFieldsLabel")}
                  />
                  {(state === "loading_config" || state === "loading_sdk") && (
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white/95 text-[11px] text-[#4a5568]">
                      <Loader2 className="size-3.5 animate-spin text-[#62a0f6]" />
                      {state === "loading_config"
                        ? t("seamless.loadingConfig")
                        : t("seamless.loadingSdk")}
                    </div>
                  )}
                </div>

                {isChallenge && challengeUrl ? (
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-[#334155]">
                      {t("seamless.challengeHint")}
                    </p>
                    <iframe
                      id={TELR_CHALLENGE_ID}
                      title={t("seamless.challengeTitle")}
                      src={challengeUrl}
                      className="h-[min(280px,38dvh)] w-full rounded-xl border border-[#d7e4f8] bg-white"
                      sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation allow-same-origin"
                    />
                    <button
                      type="button"
                      onClick={() => void handleVerifyNow()}
                      className="text-[11px] font-semibold text-[#2f6fd6] underline-offset-2 hover:underline"
                    >
                      {t("seamless.checkStatus")}
                    </button>
                  </div>
                ) : null}

                {error ? (
                  <p
                    className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] text-red-700"
                    role="alert"
                  >
                    {error}
                  </p>
                ) : null}

                {state === "paid" ? (
                  <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-800">
                    {t("seamless.paid")}
                  </p>
                ) : null}
              </>
            )}
          </div>

          <div className="border-t border-[#e4ebf7] bg-white px-3 py-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-3.5">
            {state === "unavailable" || checkoutMethod === "apple_pay" ? (
              <button
                type="button"
                onClick={() => void handleHostedFallback()}
                disabled={hostedBusy}
                className={cn(
                  "inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition disabled:opacity-60",
                  checkoutMethod === "apple_pay"
                    ? "bg-black hover:bg-neutral-900"
                    : "bg-[#143087] hover:bg-[#0f2470]"
                )}
              >
                {hostedBusy ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : checkoutMethod === "apple_pay" ? (
                  <Wallet className="size-3.5" />
                ) : (
                  <TelrLogo light showWordmark={false} />
                )}
                {checkoutMethod === "apple_pay"
                  ? t("seamless.walletContinue", {
                      method: t("seamless.methodApplePay"),
                    })
                  : t("seamless.payWithTelr")}
              </button>
            ) : showCardActions ? (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => void handlePay()}
                  disabled={
                    state === "processing" ||
                    state === "verifying" ||
                    !config
                  }
                  className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#62a0f6_0%,#2f6fd6_55%,#143087_100%)] px-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(47,111,214,0.28)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-none disabled:bg-[#c5d0e0] disabled:shadow-none"
                >
                  {state === "processing" || state === "verifying" ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      {state === "verifying"
                        ? t("seamless.verifying")
                        : t("seamless.processing")}
                    </>
                  ) : (
                    <>
                      <TelrLogo light showWordmark={false} />
                      {t("seamless.payWithTelr")}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => void handleHostedFallback()}
                  disabled={
                    hostedBusy ||
                    state === "processing" ||
                    state === "verifying"
                  }
                  className="inline-flex w-full items-center justify-center gap-1.5 py-0.5 text-[11px] font-medium text-[#143087]/80 hover:text-[#143087] disabled:opacity-50"
                >
                  {hostedBusy ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <TelrLogo className="gap-1 [&_span:not(.sr-only)]:text-[11px] [&_svg]:size-3.5" />
                  )}
                  <span>{t("seamless.continueHosted")}</span>
                </button>
              </div>
            ) : (
              <div className="flex h-9 items-center justify-center text-[11px] text-[#6b7a90]">
                <Loader2 className="me-2 size-3.5 animate-spin text-[#62a0f6]" />
                {t("seamless.loadingConfig")}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
