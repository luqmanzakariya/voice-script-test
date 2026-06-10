export const formatNumber = (
  value: number | string,
  locale = "id-ID",
): string => {
  const number = typeof value === "string" ? Number(value) : value;

  if (isNaN(number)) {
    return "0";
  }

  return new Intl.NumberFormat(locale).format(number);
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
};
