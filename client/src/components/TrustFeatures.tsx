import { Truck, Percent, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "On all orders",
  },
  {
    icon: Percent,
    title: "Extra Offers",
    desc: "Best deals & exclusive offers",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% secure payments",
  },
];

export default function TrustFeatures() {
  return (
    <section className="px-4 pt-4 pb-3">
      <div className="bg-[#fef9c3] border border-yellow-200 rounded-2xl px-3 py-3.5 grid grid-cols-3 divide-x divide-yellow-200">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center text-center px-2 gap-1.5">
            <div className="w-9 h-9 rounded-full bg-[#facc15] flex items-center justify-center shadow-2xs flex-shrink-0">
              <Icon className="w-4 h-4 text-stone-900" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-900 leading-tight uppercase tracking-tight">
                {title}
              </p>
              <p className="text-[9px] text-stone-500 leading-snug mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
