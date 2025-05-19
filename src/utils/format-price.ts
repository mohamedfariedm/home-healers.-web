const formatPrice = (
  amount: number,
  locale = "en-US",
  currency = "USD"
): string =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

export default formatPrice;
