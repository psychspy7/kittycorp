import { ProductPage,productMetadata } from "@/components/kitty/product-page";
export const dynamic="force-dynamic";
export async function generateMetadata(){return productMetadata("sentinel");}
export default function Page(){return <ProductPage slug="sentinel"/>;}
