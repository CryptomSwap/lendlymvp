"use client";

import { motion } from "framer-motion";
import { fadeInUp, scaleIn, staggerChildren } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function StyleguidePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <h1 className="text-title">Design System</h1>

      {/* Colors */}
      <section>
        <h2 className="text-h2 mb-4">Color Tokens</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-20 w-full rounded-lg bg-primary" />
            <p className="text-sm font-medium">Primary</p>
            <p className="text-xs text-muted-foreground">#0EA5A5</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-lg bg-accent" />
            <p className="text-sm font-medium">Accent</p>
            <p className="text-xs text-muted-foreground">#7C3AED</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-lg bg-success" />
            <p className="text-sm font-medium">Success</p>
            <p className="text-xs text-muted-foreground">#10b981</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-lg bg-warning" />
            <p className="text-sm font-medium">Warning</p>
            <p className="text-xs text-muted-foreground">#f59e0b</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-lg bg-danger" />
            <p className="text-sm font-medium">Danger</p>
            <p className="text-xs text-muted-foreground">#ef4444</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full rounded-lg bg-muted border border-border" />
            <p className="text-sm font-medium">Muted</p>
            <p className="text-xs text-muted-foreground">#f1f5f9</p>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-h2 mb-4">Typography</h2>
        <div className="space-y-4">
          <div>
            <p className="text-title mb-2">Title</p>
            <p className="text-caption">text-title</p>
          </div>
          <div>
            <p className="text-h1 mb-2">Heading 1</p>
            <p className="text-caption">text-h1</p>
          </div>
          <div>
            <p className="text-h2 mb-2">Heading 2</p>
            <p className="text-caption">text-h2</p>
          </div>
          <div>
            <p className="text-h3 mb-2">Heading 3</p>
            <p className="text-caption">text-h3</p>
          </div>
          <div>
            <p className="text-h4 mb-2">Heading 4</p>
            <p className="text-caption">text-h4</p>
          </div>
          <div>
            <p className="text-body mb-2">Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p className="text-caption">text-body</p>
          </div>
          <div>
            <p className="text-caption mb-2">Caption text</p>
            <p className="text-caption">text-caption</p>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-h2 mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Cards */}
      <section>
        <h2 className="text-h2 mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content with some example text.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>With different content</CardDescription>
            </CardHeader>
            <CardContent>
              <p>More card content here.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Badges/Chips */}
      <section>
        <h2 className="text-h2 mb-4">Badges & Chips</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* Form Elements */}
      <section>
        <h2 className="text-h2 mb-4">Form Elements</h2>
        <div className="space-y-4 max-w-md">
          <Input placeholder="Text input" />
          <Textarea placeholder="Textarea input" />
        </div>
      </section>

      {/* Motion Animations */}
      <section>
        <h2 className="text-h2 mb-4">Motion Examples</h2>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="space-y-4"
        >
          <motion.div variants={fadeInUp}>
            <Card>
              <CardContent className="p-6">
                <p className="text-body">Fade In Up Animation</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={scaleIn}>
            <Card>
              <CardContent className="p-6">
                <p className="text-body">Scale In Animation</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Avatar */}
      <section>
        <h2 className="text-h2 mb-4">Avatar</h2>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="/placeholder-avatar-1.jpg" />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>SL</AvatarFallback>
          </Avatar>
        </div>
      </section>

      {/* Skeleton */}
      <section>
        <h2 className="text-h2 mb-4">Skeleton</h2>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </section>
    </div>
  );
}

