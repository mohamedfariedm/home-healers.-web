import DeepLinkPage, {
  generateDeepLinkMetadata,
} from "@/components/DeepLink/DeepLinkPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generateDeepLinkMetadata("home", locale);
}

export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; segments?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <DeepLinkPage route="home" params={params} searchParams={searchParams} />
  );
}
