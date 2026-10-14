import { redirect } from "next/navigation";
import { ProductPage, productMetadata } from "@/components/kitty/product-page";
import { companyProducts } from "@/lib/company-server";
import { publishedLaunch } from "@/lib/launches-server";

export const dynamic = "force-dynamic";
export async function generateMetadata() { return productMetadata("kitty-ai"); }
export default async function Page() {
  const hasProductPage = (await companyProducts()).some(product => product.slug === "kitty-ai");
  if (!hasProductPage && await publishedLaunch("kitty-ai")) redirect("/launches/kitty-ai");
  return <ProductPage slug="kitty-ai" />;
}