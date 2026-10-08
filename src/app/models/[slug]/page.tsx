import { models, modelLoaders } from "@/generated/models";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
export const dynamicParams = false;
export function generateStaticParams() {
  return models
    .filter((m) => m.status === "live")
    .map((m) => ({ slug: m.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const model = models.find((m) => m.slug === slug);
  return { title: model?.title, description: model?.question };
}
export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const load = modelLoaders[slug as keyof typeof modelLoaders];
  if (!load) notFound();
  const { default: Model } = await load();
  return <Model />;
}
