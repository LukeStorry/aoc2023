export function lowestCommonMultiple(a, b) {
  const gcd = (a, b) => (a ? gcd(b % a, a) : b);
  return (a * b) / gcd(a, b);
}
