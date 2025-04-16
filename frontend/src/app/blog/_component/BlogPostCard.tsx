import Link from "next/link";
import React from "react";
// Image import removed
import { BlogPost } from "@/app/_global/interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, CalendarDays, UserCircle } from "lucide-react"; // Added LucideProps

interface BlogPostCardProps {
  post: BlogPost;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const IconComponent = post.icon; // Get the icon component from props

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-gray-200/80 bg-white">
      {/* Icon Area */}
      {IconComponent && ( // Only render if an icon is provided
        <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center border-b border-gray-200/60">
          <IconComponent
            className="w-10 h-10 text-indigo-500"
            strokeWidth={1.5}
          />
        </div>
      )}

      <CardHeader className="pb-3 pt-4">
        {" "}
        {/* Adjusted padding */}
        <div className="flex justify-between items-center mb-2">
          <Badge
            variant="outline"
            className="text-xs border-indigo-300 text-indigo-700"
          >
            {post.category}
          </Badge>
          <p className="text-xs text-gray-500 flex items-center">
            <CalendarDays className="h-3.5 w-3.5 mr-1" /> {post.date}
          </p>
        </div>
        <CardTitle className="text-lg font-semibold leading-snug line-clamp-2 hover:text-indigo-700 transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <CardDescription className="text-sm line-clamp-3">
          {post.excerpt}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-3 pb-4 flex justify-between items-center">
        <p className="text-xs text-gray-500 flex items-center">
          {post.author && (
            <>
              <UserCircle className="h-3.5 w-3.5 mr-1" /> {post.author}
            </>
          )}
        </p>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-indigo-600 hover:text-indigo-700 h-auto p-0 text-sm"
        >
          <Link href={`/blog/${post.slug}`}>
            Read More <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
