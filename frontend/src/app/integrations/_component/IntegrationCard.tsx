import React from "react";
// Removed Image import
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Clock, LucideProps } from "lucide-react"; // Added LucideProps

// Define the props structure for clarity - CHANGED logoUrl to icon
export interface IntegrationCardProps {
  name: string;
  description: string;
  icon: React.ElementType<LucideProps>; // Expect a Lucide icon component
  status: "Live" | "Coming Soon" | "Beta";
  category?: string;
  docsUrl?: string;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  name,
  description,
  icon: Icon,
  status,
  category,
  docsUrl, // Destructure icon as Icon (component naming convention)
}) => {
  const isComingSoon = status === "Coming Soon";
  const isBeta = status === "Beta";
  const isLive = status === "Live";

  return (
    <Card
      className={`flex flex-col h-full shadow-md border-gray-200/80 hover:shadow-lg transition-shadow duration-300 ${
        isComingSoon ? "opacity-70 bg-slate-50/50" : "bg-white"
      }`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div className="flex items-center gap-3">
          {/* Render the passed Icon component */}
          {/* Optional: Wrap icon in a styled div */}
          <div className="p-1.5 bg-indigo-50 rounded-md">
            <Icon className="w-6 h-6 text-indigo-600" strokeWidth={1.5} />
          </div>
          <CardTitle className="text-base font-semibold text-gray-800">
            {name}
          </CardTitle>
        </div>
        {/* Status Badge (remains the same) */}
        <Badge
          variant={isLive ? "default" : "secondary"}
          className={`text-xs whitespace-nowrap ${
            isLive
              ? "bg-green-100 text-green-700 border-green-200"
              : isBeta
              ? "bg-blue-100 text-blue-700 border-blue-200"
              : "bg-gray-100 text-gray-600 border-gray-200" // Coming Soon
          }`}
        >
          {isComingSoon && <Clock className="h-3 w-3 mr-1" />}
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-4">
        <CardDescription className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-3 pb-4 px-6 mt-auto">
        {/* Footer logic remains the same */}
        {isLive && docsUrl ? (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full sm:w-auto text-sm"
          >
            <Link href={docsUrl}>
              Learn More <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        ) : isComingSoon || isBeta ? (
          <span className="text-xs text-gray-500 italic w-full text-left">
            {isBeta ? "Available in Beta program." : "Integration coming soon."}
          </span>
        ) : (
          <span className="text-xs text-gray-500 italic w-full text-left">
            Configuration available within settings.
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

// Add default export if this is the only export in the file
// export default IntegrationCard;
