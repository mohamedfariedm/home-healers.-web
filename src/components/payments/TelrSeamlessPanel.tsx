"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ClientAPI from "@/app/api/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import TabbyLogo from "@/components/payments/TabbyLogo";
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
  defaultTelrHybridSelection,
  getTelrHybridPaymentMethods,
  initTelrSeamlessFields,
  isCustomerEmailRequiredError,
  isPaidStatus,
  isPaymentInProgressError,
  isTelrAlreadyPaidError,
  isTelrSessionExpiredError,
  isTerminalFailureStatus,
  startTabbyHostedRedirect,
  tryParseTelrSeamlessPayData,
  verifyTelrReturnOutcome,
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
  /** Last-resort generic Telr HPP redirect */
  onHostedFallback: () => void | Promise<void>;
  /** Navigate to Tabby / Apple Pay method URL (prefer router.push) */
  onMethodRedirect?: (url: string) => void;
  onAvailabilityChange?: (available: boolean) => void;
  className?: string;
};

const VERIFY_ATTEMPTS = 10;
const VERIFY_DELAY_MS = 1500;
const TELR_FRAME_ID = "telr_frame";
const TELR_CHALLENGE_ID = "telr_iframe";

type SelectedMethod = "card" | "tabby";

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

function CardBrandPills() {
  return (
    <div className="flex shrink-0 items-center gap-1">
      {(["mada", "VISA", "MC"] as const).map((brand) => (
        <span
          key={brand}
          className="inline-flex h-5 items-center rounded border border-[#e5ebf5] bg-white px-1.5 text-[9px] font-bold tracking-wide text-[#5b6b86]"
        >
          {brand}
        </span>
      ))}
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <span className="h-px flex-1 bg-[#e2eaf6]" />
      <span className="text-[10px] font-semibold uppercase tracking-wide text-[#7a8aa3]">
        {label}
      </span>
      <span className="h-px flex-1 bg-[#e2eaf6]" />
    </div>
  );
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
  onMethodRedirect,
  onAvailabilityChange,
  className,
}: TelrSeamlessPanelProps) {
  const { t } = useTranslation("booking");

  const [state, setState] = useState<TelrSeamlessPanelState>("idle");
  const [config, setConfig] = useState<TelrSeamlessConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [challengeUrl, setChallengeUrl] = useState<string | null>(null);
  const [hostedBusy, setHostedBusy] = useState(false);
  const [methodBusy, setMethodBusy] = useState(false);
  const [needsEmail, setNeedsEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(
    () => customerEmail?.trim() || ""
  );
  const hybridMethods = useMemo(() => getTelrHybridPaymentMethods(), []);
  const [selectedMethod, setSelectedMethod] = useState<SelectedMethod>(() =>
    defaultTelrHybridSelection(hybridMethods)
  );
  const [applePayDeviceOk, setApplePayDeviceOk] = useState(false);
  /** Card Seamless SDK / backend config failed — Tabby may still be usable. */
  const [cardSeamlessFailed, setCardSeamlessFailed] = useState(false);

  const cardTokenRef = useRef<string | null>(null);
  const attemptIdRef = useRef<number | null>(getPersistedTelrAttemptId());
  const paymentIdRef = useRef<string | null>(null);
  const submittingRef = useRef(false);
  const mountedRef = useRef(true);

  const currency = currencyLabel || t("step5.currency");
  const showCard = hybridMethods.card.enabled;
  const showTabby = hybridMethods.tabby.enabled;
  const showApplePay =
    hybridMethods.apple_pay.enabled && applePayDeviceOk;

  const locking =
    state === "processing" ||
    state === "verifying" ||
    state === "challenge" ||
    state === "paid" ||
    methodBusy;

  const setAvailable = useCallback(
    (available: boolean) => {
      onAvailabilityChange?.(available);
    },
    [onAvailabilityChange]
  );

  const goToRedirectUrl = useCallback(
    (url: string) => {
      if (onMethodRedirect) {
        onMethodRedirect(url);
        return;
      }
      if (typeof window !== "undefined") {
        window.location.assign(url);
      }
    },
    [onMethodRedirect]
  );

  useEffect(() => {
    if (customerEmail?.trim()) {
      setEmailInput(customerEmail.trim());
    }
  }, [customerEmail]);

  useEffect(() => {
    if (!open) return;
    setApplePayDeviceOk(detectApplePayAvailable());
    setSelectedMethod(defaultTelrHybridSelection(hybridMethods));
    setCardSeamlessFailed(false);
    setError(null);
  }, [hybridMethods, open]);

  useEffect(() => {
    if (!showCard && showTabby && selectedMethod === "card") {
      setSelectedMethod("tabby");
    }
    if (showCard && !showTabby && selectedMethod === "tabby") {
      setSelectedMethod("card");
    }
  }, [selectedMethod, showCard, showTabby]);

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

    const finishWithoutCardSdk = (message?: string) => {
      setConfig(null);
      setCardSeamlessFailed(true);
      if (showTabby || showApplePay) {
        if (showTabby) setSelectedMethod("tabby");
        setState("ready");
        setAvailable(true);
        if (message) setError(message);
        return;
      }
      setState("unavailable");
      setAvailable(false);
      if (message) setError(message);
    };

    const boot = async () => {
      setState("loading_config");
      setError(null);
      setChallengeUrl(null);
      cardTokenRef.current = null;
      setCardSeamlessFailed(false);

      if (!showCard && !showTabby && !showApplePay) {
        setConfig(null);
        setState("unavailable");
        setAvailable(false);
        return;
      }

      // Tabby / Apple Pay do not require Seamless Card config or SDK.
      if (!showCard) {
        setConfig(null);
        setSelectedMethod("tabby");
        setState("ready");
        setAvailable(true);
        return;
      }

      const resolved = await resolveTelrSeamlessConfig(locale);
      if (cancelled) return;

      if (!resolved) {
        finishWithoutCardSdk(
          showTabby ? undefined : t("seamless.unavailable")
        );
        return;
      }

      setConfig(resolved);
      setAvailable(true);
      setState("loading_sdk");
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
          const mount = document.getElementById(TELR_FRAME_ID);
          const injected = Boolean(mount && mount.childElementCount > 0);
          if (!injected) {
            finishWithoutCardSdk(t("seamless.sdkLoadFailed"));
            return;
          }
          setCardSeamlessFailed(false);
          setState("ready");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Telr Seamless SDK init failed:", err);
        finishWithoutCardSdk(
          showTabby
            ? undefined
            : err instanceof Error
              ? err.message
              : t("seamless.sdkLoadFailed")
        );
      }
    };

    void boot();

    return () => {
      cancelled = true;
      clearTelrFrameMount(TELR_FRAME_ID);
    };
  }, [
    locale,
    open,
    setAvailable,
    showApplePay,
    showCard,
    showTabby,
    t,
  ]);

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

  const handleCardPay = useCallback(async () => {
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

  const handleTabbyPay = useCallback(async () => {
    if (methodBusy) return;
    setMethodBusy(true);
    setError(null);
    persistReservationId(reservationId);

    try {
      const { redirectUrl } = await startTabbyHostedRedirect({
        reservationId,
        locale,
      });
      const pendingAttempt = getPersistedTelrAttemptId();
      if (pendingAttempt != null) {
        attemptIdRef.current = pendingAttempt;
      }
      onOpenChange(false);
      goToRedirectUrl(redirectUrl);
    } catch (err) {
      console.error("Telr Tabby pay error:", err);
      if (isTelrAlreadyPaidError(err)) {
        onOpenChange(false);
        onPaid({ paymentId: null, reservationId });
        return;
      }
      if (isTelrSessionExpiredError(err)) {
        const message = t("seamless.sessionExpired");
        setError(message);
        toast.error(message);
        return;
      }
      if (isPaymentInProgressError(err)) {
        const outcome = await verifyTelrReturnOutcome(
          reservationId,
          locale,
          attemptIdRef.current
        );
        if (outcome === "paid") {
          onOpenChange(false);
          onPaid({ paymentId: null, reservationId });
          return;
        }
        const message = t("seamless.paymentInProgress");
        setError(message);
        toast.error(message);
        return;
      }
      const message =
        err instanceof Error ? err.message : t("messages.paymentFailed");
      setError(message);
      toast.error(message);
    } finally {
      setMethodBusy(false);
    }
  }, [
    goToRedirectUrl,
    locale,
    methodBusy,
    onOpenChange,
    onPaid,
    reservationId,
    t,
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
  const cardSdkReady =
    state === "ready" ||
    state === "failed" ||
    state === "cancelled" ||
    state === "processing" ||
    state === "verifying";
  const cardSdkUsable = showCard && !cardSeamlessFailed && Boolean(config);
  const showCardMount =
    cardSdkUsable &&
    state !== "unavailable" &&
    !isChallenge &&
    selectedMethod === "card";
  const showCardPay =
    cardSdkUsable &&
    selectedMethod === "card" &&
    !isChallenge &&
    state !== "paid" &&
    state !== "loading_config" &&
    state !== "loading_sdk" &&
    state !== "unavailable";
  const showCardHostedFallback =
    showCard &&
    selectedMethod === "card" &&
    (cardSeamlessFailed || state === "unavailable") &&
    !isChallenge &&
    state !== "paid";
  const noMethodsConfigured = !showCard && !showTabby && !showApplePay;

  const selectMethod = (method: SelectedMethod) => {
    if (locking) return;
    setSelectedMethod(method);
    setError(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && locking && state !== "paid") {
          return;
        }
        onOpenChange(next);
      }}
    >
      <DialogContent
        showCloseButton={!locking || state === "paid"}
        overlayClassName="z-[10040] bg-[#0b1a45]/60 backdrop-blur-[3px]"
        className={cn(
          "fixed inset-x-0 bottom-0 top-auto z-[10050] flex w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-t-2xl border-[#d7e4f8] bg-transparent p-0 shadow-[0_-12px_40px_rgba(20,48,135,0.22)] duration-300",
          "data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4",
          "sm:inset-auto sm:top-[50%] sm:bottom-auto sm:left-[50%] sm:max-w-[400px] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl sm:shadow-[0_20px_50px_rgba(20,48,135,0.24)] sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=closed]:slide-out-to-bottom-0",
          "[&_[data-slot=dialog-close]]:top-2.5 [&_[data-slot=dialog-close]]:end-2.5 [&_[data-slot=dialog-close]]:start-auto [&_[data-slot=dialog-close]]:right-auto [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:bg-white/15 [&_[data-slot=dialog-close]]:p-1 [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:opacity-100 [&_[data-slot=dialog-close]]:hover:bg-white/25",
          isChallenge && "sm:max-w-[480px]",
          className
        )}
      >
        <div className="relative flex max-h-[min(92dvh,680px)] flex-col overflow-hidden bg-[#f4f7fc] sm:rounded-2xl">
          <div
            aria-hidden
            className="mx-auto mt-1.5 h-1 w-8 shrink-0 rounded-full bg-[#c9d7ef] sm:hidden"
          />

          <header className="relative shrink-0 bg-[linear-gradient(145deg,#0d1f63_0%,#143087_52%,#2f6fd6_100%)] px-3 py-2.5 pe-10 text-white sm:px-3.5 sm:py-3 sm:pe-11">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <DialogTitle className="text-start text-sm font-bold tracking-tight text-white sm:text-[15px]">
                  {t("seamless.title")}
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-start text-[11px] leading-snug text-white/75">
                  {t("seamless.customMethodsSubtitle")}
                </DialogDescription>
              </div>
              <div className="shrink-0 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-end">
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

          <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-3 py-2.5 sm:px-3.5 sm:py-3">
            <div
              className={cn(
                "space-y-2.5",
                (isChallenge || state === "paid") && "hidden"
              )}
            >
              {showApplePay ? (
                <button
                  type="button"
                  disabled={locking}
                  onClick={() => {
                    /* Apple Pay not supported by current backend method/pay */
                  }}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-black px-4 text-sm font-semibold text-white transition hover:bg-neutral-900 disabled:opacity-60"
                >
                  {methodBusy ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="size-4 fill-current"
                      aria-hidden
                    >
                      <path d="M16.7 12.6c0-2 1.6-3 1.7-3.1-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.8-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.2-.9-2.2-3.5ZM14.4 6.8c.6-.7 1-1.7.9-2.7-1 .1-2.1.7-2.7 1.4-.6.7-1.1 1.7-.9 2.6 1 .1 2.1-.5 2.7-1.3Z" />
                    </svg>
                  )}
                  {t("seamless.buyWithApplePay")}
                </button>
              ) : null}

              {showCard ? (
                <div className="space-y-1.5">
                  <SectionDivider label={t("seamless.sectionCards")} />
                  <div
                    className={cn(
                      "overflow-hidden rounded-xl border bg-white transition",
                      selectedMethod === "card"
                        ? "border-[#143087] shadow-[0_0_0_1px_rgba(20,48,135,0.12)]"
                        : "border-[#e2eaf6]"
                    )}
                  >
                    <button
                      type="button"
                      disabled={locking}
                      onClick={() => selectMethod("card")}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-start disabled:opacity-50"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eef4ff] text-[#143087]">
                        <CreditCard className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1 text-xs font-semibold text-[#143087]">
                        {t("seamless.methodCard")}
                      </span>
                      <CardBrandPills />
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                          selectedMethod === "card"
                            ? "border-[#143087]"
                            : "border-[#c5d0e0]"
                        )}
                        aria-hidden
                      >
                        {selectedMethod === "card" ? (
                          <span className="size-2 rounded-full bg-[#143087]" />
                        ) : null}
                      </span>
                    </button>

                    <div
                      className={cn(
                        "space-y-2 border-t border-[#eef2f8] px-3 pb-3 pt-2",
                        selectedMethod !== "card" && "hidden"
                      )}
                    >
                      <p className="flex items-center gap-1.5 text-[10px] text-[#5b6b86]">
                        <ShieldCheck className="size-3 shrink-0 text-[#62a0f6]" />
                        <span className="truncate">{t("seamless.lockHint")}</span>
                      </p>

                      {needsEmail &&
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
                          "relative overflow-hidden rounded-lg border border-[#e5ebf5] bg-white",
                          !showCardMount &&
                            "invisible absolute h-0 overflow-hidden p-0"
                        )}
                      >
                        <div
                          id={TELR_FRAME_ID}
                          className="min-h-[84px] w-full bg-white p-2 sm:min-h-[90px]"
                          aria-label={t("seamless.cardFieldsLabel")}
                        />
                        {(state === "loading_config" ||
                          state === "loading_sdk") && (
                          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white/95 text-[11px] text-[#4a5568]">
                            <Loader2 className="size-3.5 animate-spin text-[#62a0f6]" />
                            {state === "loading_config"
                              ? t("seamless.loadingConfig")
                              : t("seamless.loadingSdk")}
                          </div>
                        )}
                      </div>

                      {showCardPay ? (
                        <button
                          type="button"
                          onClick={() => void handleCardPay()}
                          disabled={
                            state === "processing" ||
                            state === "verifying" ||
                            !config ||
                            !cardSdkReady
                          }
                          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#62a0f6_0%,#2f6fd6_55%,#143087_100%)] px-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(47,111,214,0.28)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-none disabled:bg-[#c5d0e0] disabled:shadow-none"
                        >
                          {state === "processing" || state === "verifying" ? (
                            <>
                              <Loader2 className="size-3.5 animate-spin" />
                              {state === "verifying"
                                ? t("seamless.verifying")
                                : t("seamless.processing")}
                            </>
                          ) : (
                            t("seamless.payAmount", { amount, currency })
                          )}
                        </button>
                      ) : null}

                      {showCardHostedFallback ? (
                        <div className="space-y-2">
                          <p className="text-[11px] leading-snug text-[#4a5568]">
                            {t("seamless.useHostedHint")}
                          </p>
                          <button
                            type="button"
                            onClick={() => void handleHostedFallback()}
                            disabled={hostedBusy}
                            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#143087] px-4 text-sm font-semibold text-white disabled:opacity-60"
                          >
                            {hostedBusy ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <TelrLogo light showWordmark={false} />
                            )}
                            {t("seamless.openCheckout")}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              {showTabby ? (
                <div className="space-y-1.5">
                  <SectionDivider label={t("seamless.sectionPayLater")} />
                  <div
                    className={cn(
                      "overflow-hidden rounded-xl border bg-white transition",
                      selectedMethod === "tabby"
                        ? "border-[#00a9a5] shadow-[0_0_0_1px_rgba(0,169,165,0.18)]"
                        : "border-[#e2eaf6]"
                    )}
                  >
                    <button
                      type="button"
                      disabled={locking}
                      onClick={() => selectMethod("tabby")}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-start"
                    >
                      <TabbyLogo />
                      <span className="min-w-0 flex-1 text-xs font-semibold text-[#143087]">
                        {t("seamless.methodTabby")}
                      </span>
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                          selectedMethod === "tabby"
                            ? "border-[#00a9a5]"
                            : "border-[#c5d0e0]"
                        )}
                        aria-hidden
                      >
                        {selectedMethod === "tabby" ? (
                          <span className="size-2 rounded-full bg-[#00a9a5]" />
                        ) : null}
                      </span>
                    </button>

                    {selectedMethod === "tabby" ? (
                      <div className="space-y-2 border-t border-[#eef2f8] px-3 pb-3 pt-2">
                        <p className="text-[11px] leading-snug text-[#4a5568]">
                          {t("seamless.methodTabbyHint")}
                        </p>
                        <button
                          type="button"
                          onClick={() => void handleTabbyPay()}
                          disabled={methodBusy}
                          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#00a9a5] px-4 text-sm font-semibold text-white transition hover:bg-[#009390] disabled:opacity-60"
                        >
                          {methodBusy ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <TabbyLogo className="bg-white/20 [&_span:not(.sr-only)]:text-white" />
                          )}
                          {t("seamless.payAmount", { amount, currency })}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {noMethodsConfigured ||
              (state === "unavailable" && !showTabby && showCard) ? (
                <div className="rounded-xl border border-amber-200/80 bg-amber-50/90 p-2.5 text-amber-950">
                  <p className="text-xs font-semibold">
                    {t("seamless.unavailable")}
                  </p>
                  <p className="mt-0.5 text-[11px] opacity-90">
                    {t("seamless.useHostedHint")}
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleHostedFallback()}
                    disabled={hostedBusy}
                    className="mt-2 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-[#143087] px-4 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {hostedBusy ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <TelrLogo light showWordmark={false} />
                    )}
                    {t("seamless.payWithTelr")}
                  </button>
                </div>
              ) : null}
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
                  className="h-[min(260px,36dvh)] w-full rounded-xl border border-[#d7e4f8] bg-white"
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
          </div>

          {!isChallenge && state !== "paid" ? (
            <div className="shrink-0 border-t border-[#e4ebf7] bg-white px-3 py-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] sm:px-3.5">
              <div className="flex items-center justify-center gap-2 text-[10px] text-[#7a8aa3]">
                <TelrLogo className="gap-1 [&_span:not(.sr-only)]:text-[11px] [&_svg]:size-3.5" />
                <span>{t("seamless.poweredByTelr")}</span>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
