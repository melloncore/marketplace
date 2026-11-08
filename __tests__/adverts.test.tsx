import { screen } from "@testing-library/react";
import MarketplaceAdvertSection from "@/components/MarketplaceAdvertSection";
import { listMarketplaceAdverts } from "@/lib/api/adverts";
import { renderWithCart } from "./test-utils";

jest.mock("@/lib/api/adverts", () => ({
  listMarketplaceAdverts: jest.fn(),
}));

describe("MarketplaceAdvertSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows active text and image adverts", async () => {
    (listMarketplaceAdverts as jest.Mock).mockResolvedValue([
      {
        id: "text-ad",
        title: "Weekend sale",
        description: "Save on selected laptops.",
        imageUrl: null,
        imageAlt: null,
        linkUrl: "/cart",
        active: true,
        sortOrder: 0,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "image-ad",
        title: "New arrivals",
        description: null,
        imageUrl: "https://res.cloudinary.com/test/ad.png",
        imageAlt: "New laptop arrivals",
        linkUrl: null,
        active: true,
        sortOrder: 1,
        createdAt: "",
        updatedAt: "",
      },
    ]);

    renderWithCart(<MarketplaceAdvertSection />);

    expect(await screen.findByText("Weekend sale")).toBeInTheDocument();
    expect(screen.getByText("Save on selected laptops.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Weekend sale/ })).toHaveAttribute("href", "/cart");
    expect(screen.getByRole("img", { name: "New laptop arrivals" })).toHaveAttribute(
      "src",
      "https://res.cloudinary.com/test/ad.png",
    );
  });

  it("keeps the existing marketplace message when no adverts are active", async () => {
    (listMarketplaceAdverts as jest.Mock).mockResolvedValue([]);

    renderWithCart(<MarketplaceAdvertSection />);

    expect(await screen.findByText("Laptops, phones and accessories, delivered to your door."))
      .toBeInTheDocument();
  });
});
