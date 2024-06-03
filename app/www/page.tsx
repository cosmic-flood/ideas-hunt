'use client';

import { Button } from '@/components/ui/shadcn-button';
import { FaDiscord, FaCheckCircle } from 'react-icons/fa';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn-card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default async function Page() {
  return (
    <div className="container px-0 xl:px-24">
      <div className="container mb-10 px-0 sm:mt-5 md:mt-28">
        <div className="container mx-auto max-w-screen-xl px-0">
          <h1 className="text-5xl font-bold">
            Discovering Leads & Validating Ideas on{' '}
            <span className="text-primary"> Reddit</span>
          </h1>

          <h3 className="mt-6 text-xl">
            Our AI technology quickly identifies posts that are highly relevant
            to your business or idea and notifies you instantly. You can then
            share your high-quality solution in the comments, seamlessly
            engaging with millions of potential customers accurately —{' '}
            <span className="text-primary">
              while fully respecting Reddit's culture.
            </span>
          </h3>
        </div>
      </div>

      <div className="container mb-16 mt-10 gap-x-1.5 px-0">
        <div>
          <Button className="p-7 text-2xl ">Start 7 Days Free Trial</Button>
        </div>
        <div>
          <Button className="mt-3 px-3 text-lg">
            <FaDiscord className="mr-2" /> Join Discord
          </Button>
        </div>
      </div>

      <div className="mb-18 container mt-8 border-t py-0 text-center" />

      <div className="container mb-16 px-0 sm:mt-5 md:mt-20">
        <div className="container mx-auto max-w-screen-xl px-0">
          <h1 className="text-4xl font-bold">
            Why & How to Discover Leads on Reddit
          </h1>

          <h3 className="mt-6 text-xl">
            Reddit hosts a vast number of active users who continuously share
            their needs, problems, and ideas, making it an ideal platform for
            discovering leads and validating ideas.
          </h3>
          <h3 className="mt-6 text-xl">
            By leaving high-quality comments on posts that are highly relevant
            to your solution, you can{' '}
            <strong className="text-primary">
              engage with millions of potential customers accurately
            </strong>{' '}
            without incurring advertising costs or violating Reddit's rules. At
            the same time, you'll be contributing to the community.
          </h3>
        </div>
      </div>

      <div className="container mb-8 mt-8 border-t py-0 text-center" />

      <div className="container mb-8 gap-6 px-0 sm:mt-5 md:mt-20">
        <div className="container mx-auto max-w-screen-xl px-0">
          <h1 className="text-4xl font-bold">How does RedditSale work?</h1>
          <h3 className="mt-6 text-xl">
            Replicate <strong className="text-primary">Zapier</strong>'s path to
            success, understand how to discover leads on Reddit in six steps :
          </h3>
        </div>

        <div className="sm:grid-cols mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Badge className="rounded-full"> 1 </Badge>
                <span className="px-3">Describe your Product/Solution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Describe your product or solution (ideas are also welcome) for
                finding sales leads on Reddit. Provide detailed information so
                RedditSale.com can match and assess how well your solution,
                product, or idea corresponds to the needs expressed in these
                posts.
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between"></CardFooter>
          </Card>
          <Card className=" min-h-56">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Badge className="rounded-full"> 2 </Badge>
                <span className="px-3">Adding Subreddits</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your solution can assist numerous posts and users across various
                subreddits. To maximize your opportunities to find leads and
                validate your idea, you should add as many subreddits as
                possible to RedditSale. This will enable AI to help you find
                more relevant posts.
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between"></CardFooter>
          </Card>
          <Card className=" min-h-56">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Badge className="rounded-full"> 3 </Badge>
                <span className="px-3">AI helps discover opportunities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                RedditSale will monitor posts across the subreddits you have
                added. For each post, RedditSale will assess how well your
                solution corresponds to the needs expressed in the post and give
                it a score from{' '}
                <strong>1 to 10, with 10 being the highest</strong>.
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between"></CardFooter>
          </Card>
          <Card className=" min-h-56">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Badge className="rounded-full"> 4 </Badge>
                <span className="px-3">Receive Notifs for Matched Posts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                When a new post is highly relevant to your solution, RedditSale
                will instantly notify you via email (Alternatively, you can
                visit the dashboard to view posts scores). This allows you to be
                among the first to leave high-quality comments on the posts.
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between"></CardFooter>
          </Card>
          <Card className=" min-h-56">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Badge className="rounded-full"> 5 </Badge>
                <span className="px-3">Leave High Quality Comments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Leave your unique insights along with your professional opinion.
                If Redditors find your comments helpful, they'll upvote them,
                increasing exposure for your solution, product, or ideas to more
                potential customers and garnering additional feedback.
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between"></CardFooter>
          </Card>
          <Card className=" min-h-56">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Badge className="rounded-full"> 6 </Badge>
                <span className="px-3">Boost Your Visibility</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                The more posts you comment on and the higher the quality of your
                comments, the greater your exposure. A single high-quality
                comment could attract tens of thousands of potential customers.
                This is an excellent strategy for validating your ideas and
                finding leads.
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between"></CardFooter>
          </Card>
        </div>
      </div>

      <div className="container mb-16 mt-10 flex items-center justify-start gap-x-1.5 px-0">
        <div>
          <Button className="p-7 text-2xl ">Start 7 Days Free Trial</Button>
        </div>
      </div>

      <div className="container mb-8 mt-8 border-t py-0 text-center" />

      <div className="container mb-10 px-0 sm:mt-5 md:mt-20">
        <div className="sm:grid-cols md:grid-cols mt-8 grid gap-20 lg:grid-cols-2">
          <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-80 flex-auto text-lg">
                  Winning 100 Times More Than You Invest
                </span>

                <div className="w-20 flex-auto">
                  <Badge className="self)end rounded-full"> Best ROI </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <div>
                  <div>
                    Save significant time and ads investment to discover leads
                    and validating ideas for your job, for fun, or anything
                    else.
                  </div>
                  <div className="mt-8 rounded-md border px-2 py-10">
                    <div className="mx-auto flex w-72 items-center">
                      <div className="mx-2 text-5xl font-extrabold">$39.9</div>
                      <Separator orientation="vertical" />
                      <div className="mx-2">
                        <div className="">Per Month</div>
                        <Separator orientation="horizontal" />
                        <div className="text-sm">plus local tax</div>
                      </div>
                    </div>
                  </div>
                  <div className="container mx-auto mt-8">
                    <div className="flex items-center justify-start mb-2">
                      <FaCheckCircle className="mx-4" />
                      <span className="">Accept terms and conditions</span>
                    </div>
                    <div className="flex items-center justify-start mb-2">
                      <FaCheckCircle className="mx-4" />
                      <span className="">Accept terms and conditions</span>
                    </div>
                    <div className="flex items-center justify-start mb-2">
                      <FaCheckCircle className="mx-4" />
                      <span className="">Accept terms and conditions</span>
                    </div>
                    <div className="flex items-center justify-start mb-2">
                      <FaCheckCircle className="mx-4" />
                      <span className="">Accept terms and conditions</span>
                    </div>
                    <div className="flex items-center justify-start mb-2">
                      <FaCheckCircle className="mx-4" />
                      <span className="">Accept terms and conditions</span>
                    </div>
                    <div className="flex items-center justify-start mb-2">
                      <FaCheckCircle className="mx-4" />
                      <span className="">Accept terms and conditions</span>
                    </div>
                  </div>
                </div>
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between"></CardFooter>
          </Card>
          <div className="">
            <div className="text-2xl">FAQ</div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                  Yes. It comes with default styles that matches the other
                  components&apos; aesthetic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>
                  Yes. It&apos;s animated by default, but you can disable it if
                  you prefer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      <div className="container h-12" />
    </div>
  );
}
