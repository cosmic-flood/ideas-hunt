'use client';

import { Button } from '@/components/ui/shadcn-button';
import { FaDiscord, FaCheckCircle } from 'react-icons/fa';
import { FaRedditAlien } from "react-icons/fa";
import { FaReddit } from "react-icons/fa";
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

export default function Page() {
  return (
    <div className="container px-0 xl:px-10">
      <div className="container mb-10 px-0 sm:mt-5 md:mt-12">
        <div className="container mx-auto max-w-screen-xl px-0">
          <h1 className="text-5xl font-bold">
            Grow ten times faster with
            <span className="text-primary"> R</span>eddit
            <span className="text-primary">S</span>ale.
          </h1>
        </div>
      </div>

      <div className="sm:grid-cols md:grid-cols container mb-16 mt-10 grid gap-8 px-0 lg:grid-cols-8">
        <div className="lg:col-span-4">
          <h3 className="mt-6 text-xl">
            Discover leads by using AI to identify new & highly relevant <strong className="text-primary">Reddit</strong> posts
            and instantly notify you. Share your professional{' '}
            <strong className="text-primary">comment</strong> to{' '}
            <strong className="text-primary">
              reach millions of potential customers
            </strong>
            .
          </h3>
          <div className="mt-10">
            <Button
              className="mb-3 mr-3 p-7 text-xl"
              onClick={() => {
                window.location.href = `${window.location.protocol}//app.${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
              }}
            >
              <FaRedditAlien className="mx-2" />
              Start 3 Days Free Trial
            </Button>
            <Button className="p-7 text-xl">
              <FaDiscord className="mr-2" /> Join Discord
            </Button>
            <a href="https://discord.gg/frDNhcmWr2"></a>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="mb-3 mt-6 flex items-center justify-start ">
            <FaReddit className="mx-3 text-xl" />
            <span className="text-lg">A professional comment can easily get paying users</span>
          </div>
          <div className="mb-3 flex items-center justify-start ">
            <FaReddit className="mx-3 text-xl" />
            <span className="text-lg">One highly upvoted comment equals the top 3 SEO for a keyword</span>
          </div>
          <div className="mb-3 flex items-center justify-start">
            <FaReddit className="mx-3 text-xl" />
            <span className="text-lg">3 highly upvoted comments <strong>&gt;</strong> ProductHunt's daily top 3</span>
          </div>
          <div className="mb-3 flex items-center justify-start">
            <FaReddit className="mx-3 text-xl" />
            <span className="text-lg">Replicate Zapier's path to sucess</span>
          </div>
        </div>
      </div>

      <div className="container relative mb-16 mt-10 px-0">
        <video
          id="video-intro"
          className="w-full rounded-lg border-2 border-primary shadow-md shadow-primary"
          poster="dashboard.png"
        >
          <source src="intro.mp4" type="video/mp4" />
        </video>
        <div id="video-button" className="absolute inset-0 h-full w-full">
          <div className="flex h-full items-center justify-center">
            <Button
              className="p-12 text-5xl"
              onClick={() => {
                const introVideo = document.getElementById('video-intro')! as HTMLVideoElement;
                const introButton = document.getElementById('video-button')!;
                introVideo.setAttribute('controls', 'controls');
                introButton.style.display = 'none';
                introVideo.play();
              }}
            >
              PLAY
            </Button>
          </div>
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
          <Button
            className="p-7 text-xl"
            onClick={() => {
              window.location.href = `${window.location.protocol}//app.${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
            }}
          >
            Start 3 Days Free Trial
          </Button>
        </div>
      </div>

      <div className="container mb-8 mt-8 border-t py-0 text-center" />

      <div className="container mb-10 px-0 sm:mt-5 md:mt-20">
        <div className="sm:grid-cols md:grid-cols mt-8 grid gap-16 lg:grid-cols-8">
          <Card className="lg:col-span-4">
            <CardHeader>
              <Badge className="my-2 flex animate-bounce flex-row items-center rounded-lg px-3 py-2 text-sm">
                <span className="">Limited Offer — </span>
                <span className="ml-2 font-normal line-through">$119</span>
                <span className="ml-1 font-normal">
                  $69.9 for the first 3 months.
                </span>
              </Badge>
              <CardTitle className="flex items-center">
                <span className="w-full flex-auto text-2xl">
                  Achieving 100 Times More ROI
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div className="text-black">
                  Save significant time and ads investment to discover leads and
                  validating ideas for your job, for fun, or anything else.
                </div>
                <div className="grid-cols mt-8 grid place-items-center rounded-md border px-2 py-10">
                  <div className="mx-auto flex w-64 items-center ">
                    <div className="mx-2 text-5xl font-extrabold text-black">
                      $39.9
                    </div>
                    <Separator orientation="vertical" />
                    <div className="mx-1">
                      <div className="text-gray-900">Per Month</div>
                      <Separator orientation="horizontal" />
                      <div className="text-sm">plus local tax</div>
                    </div>
                  </div>
                </div>
                <div className="container mx-auto mt-8 text-black">
                  <div className="mb-2 flex items-center justify-start ">
                    <FaCheckCircle className="mx-3" />
                    <span className="">Subscribe to up to 30 subreddits.</span>
                  </div>
                  <div className="mb-2 flex items-center justify-start">
                    <FaCheckCircle className="mx-3" />
                    <span className="">Automatically monitor new posts.</span>
                  </div>
                  <div className="mb-2 flex items-center justify-start">
                    <FaCheckCircle className="mx-3" />
                    <span className="">
                      Get email alerts for relevant posts.
                    </span>
                  </div>
                  <div className="mb-2 flex items-center justify-start">
                    <FaCheckCircle className="mx-3" />
                    <span className="">
                      Freely discover leads and validate ideas.
                    </span>
                  </div>
                  <div className="mb-2 flex items-center justify-start">
                    <FaCheckCircle className="mx-3" />
                    <span className="">
                      Earn karma for your excellent comments.
                    </span>
                  </div>
                  <div className="mb-2 flex items-center justify-start">
                    <FaCheckCircle className="mx-3" />
                    <span className="">
                      Acquire paying customers cost-effectively.
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className="my-5 w-full py-6"
              onClick={()=>{
                window.location.href = `${window.location.protocol}//app.${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
              }}>
                <span className="text-xl font-semibold">Get Started</span>
                <span className="mx-2 text-lg italic">- 3 Days Free</span>
              </Button>
            </CardFooter>
          </Card>
          <div className="lg:col-span-4">
            <div className="mb-8 mt-5 text-3xl font-bold">FAQ</div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg">
                  Why on Reddit?
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  Reddit boasts high user activity and subreddits allow for
                  precise targeting. Its highly upvoted posts and comments are
                  easily indexed by Google. Regular activity on Reddit can
                  provide more visibility than ProductHunt's Daily Top 3.
                  Additionally, Reddit's downvote option ensures that
                  high-quality comments stand out.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg">
                  Can it suggests subreddits for me?
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  It's on our roadmap. In the meantime, please join our Discord
                  community or send us an email at contact@redditsale.com. We
                  are happy to help you manually, which also gives us more
                  experience. By the way, you should also try to discover more
                  relevant communities on your own. This can help increase your
                  conversion rate.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg">
                  Do you have an AI auto-reply feature?
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  No, we strongly advise against using an AI auto-reply. It can
                  damage the community and your product brand. The ROI of
                  writing a comment with unique insights and solutions will be
                  100 times greater than that of an auto-reply in terms of
                  visibility. The members of the subreddit will be happy to
                  mention your insights and product in comments on other posts.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg">
                  Why check only new posts?
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  Because leaving a comment under a historical post won’t
                  attract many views. The lifecycle of a Reddit post is about 16
                  hours. It's important to comment as early as possible to share
                  your unique insights, solutions, and product.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg">
                  How to find leads and validate ideas on Reddit?
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  Use RedditSale.com to find posts relevant to your business (or
                  ideas) and leave a quality comment under each post as early as
                  posible. Monitor as many subreddits as possible to increase
                  your chances of discovering more relevant posts.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg">
                  Can I add more subreddits?
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  If this is important to you, feel free to reach out to
                  contact@redditsale.com or join our{' '}
                  <a
                    href="https://discord.gg/frDNhcmWr2"
                    className="text-primary"
                  >
                    Discord
                  </a>
                  . We will be happy to answer any questions you have.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-lg">
                  Can I add more solution/products/ideas?
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  If this is important to you, feel free to reach out to
                  contact@redditsale.com or join our{' '}
                  <a
                    href="https://discord.gg/frDNhcmWr2"
                    className="text-primary"
                  >
                    Discord
                  </a>
                  . We will be happy to answer any questions you have.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-8">
                <AccordionTrigger className="text-lg">
                  I still have questions, can I talk to someone?
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  Absolutely! Feel free to reach out to contact@redditsale.com
                  or Join{' '}
                  <a
                    href="https://discord.gg/frDNhcmWr2"
                    className="text-primary"
                  >
                    Discord
                  </a>
                  , we will be happy to answer any questions for you.
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
