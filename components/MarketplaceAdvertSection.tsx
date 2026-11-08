"use client";

import { FiArrowUpRight } from "react-icons/fi";
import { useMarketplaceAdverts } from "@/lib/api";
import type { MarketplaceAdvert } from "@/lib/api/adverts";

const defaultAdvert: MarketplaceAdvert = {
  id: "default-marketplace-advert",
  title: "Laptops, phones and accessories, delivered to your door.",
  description: "Pick a gadget, enter your delivery address, pay securely.",
  imageUrl: null,
  imageAlt: null,
  linkUrl: null,
  active: true,
  sortOrder: 0,
  createdAt: "",
  updatedAt: "",
};

function AdvertCard({ advert }: { advert: MarketplaceAdvert }) {
  const content = (
    <>
      {advert.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={advert.imageUrl}
          alt={advert.imageAlt ?? ""}
          className="min-h-48 w-full flex-none object-cover sm:w-2/5"
        />
      )}
      <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
        <h2 className="max-w-xl text-2xl font-extrabold leading-tight sm:text-4xl">
          {advert.title}
        </h2>
        {advert.description && (
          <p className="mt-3 max-w-lg text-white/70">{advert.description}</p>
        )}
        {advert.linkUrl && (
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
            Learn more <FiArrowUpRight aria-hidden="true" />
          </span>
        )}
      </div>
    </>
  );

  if (advert.linkUrl) {
    const external = /^https?:\/\//i.test(advert.linkUrl);
    return (
      <a
        href={advert.linkUrl}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="flex min-h-48 overflow-hidden rounded-2xl bg-ink text-white transition hover:brightness-110"
      >
        {content}
      </a>
    );
  }

  return (
    <article className="flex min-h-48 overflow-hidden rounded-2xl bg-ink text-white">
      {content}
    </article>
  );
}

export default function MarketplaceAdvertSection() {
  const advertsQuery = useMarketplaceAdverts();
  const adverts = advertsQuery.data?.length ? advertsQuery.data : [defaultAdvert];

  return (
    <section aria-label="Marketplace adverts" className="mb-8 space-y-3">
      {advertsQuery.isError && (
        <p role="status" className="text-sm text-red-700">
          Current adverts could not be loaded. Showing the default marketplace message.
        </p>
      )}
      <div className="grid gap-4">
        {adverts.map((advert) => (
          <AdvertCard key={advert.id} advert={advert} />
        ))}
      </div>
    </section>
  );
}
