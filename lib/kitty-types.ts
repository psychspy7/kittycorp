export type Notice = {
  id: string;
  title: string;
  body: string;
  category: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
export type Feedback = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};
export const categories = [
  "Studio note",
  "Development",
  "Launch note",
  "Community",
] as const;
export const wallets = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    network: "BITCOIN",
    address: "bc1qvn36dkzq7wjq634j6yszg87yy252h7tx97pluc",
    qr: "/brand/btc-qr.svg",
  },
  {
    name: "Tether",
    symbol: "USDT",
    network: "ETHEREUM",
    address: "0x5fa72e223cF8F270aC7bb329ceADBC2b4610d098",
    qr: "/brand/usdt-qr.svg",
  },
];
