import Image, { StaticImageData } from "next/image"
import { Button } from "@/components/ui/button"

interface FeatureCardProps {
  image: string | StaticImageData
  title: string
  description: string
   learnMoreLink: string
}

export default function FeatureCard({ image, title, description, learnMoreLink}: FeatureCardProps) {
  return (
    <div className="flex flex-col md:flex-row border border-gray-300 rounded-xl bg-white overflow-hidden h-full max-w-xl mx-auto">
      {/* Content Section */}
      <div className="flex flex-col justify-center p-6 flex-1 md:w-1/2">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-[#000000] mb-4">{description}</p>
          <Button variant="link" className="p-0 h-auto text-sm text-black font-medium text-left" asChild>
              <a href={learnMoreLink}>Learn More →</a>
            </Button>
      </div>
      {/* Image Section */}
      <div className="flex items-center justify-center md:w-1/2 p-6">
        <div className="relative w-full aspect-square">
          <Image src={image} alt={title} fill className="object-contain" />
        </div>
      </div>
    </div>
  )
}
