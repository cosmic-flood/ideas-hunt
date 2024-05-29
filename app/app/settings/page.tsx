export default async function Page() {
  return <>Hello, world!</>;
  // const supabase = createClient();
  //
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // if (!user) {
  //   return redirect('/signin');
  // }
  //
  // const userId = '4a9184bd-357d-42b1-80ab-3d471e54a16c';
  //
  // const product = await fetchProduct(userId);
  // const subreddits = await fetchSubreddits(userId);
  //
  // return (
  //   <div className="flex w-full flex-col gap-8">
  //     <Card className="flex-1 shadow-none">
  //       <CardHeader>
  //         <CardTitle>Product</CardTitle>
  //         <CardDescription>Describe your product here.</CardDescription>
  //       </CardHeader>
  //       <CardContent>
  //         <ProductForm product={product} />
  //       </CardContent>
  //     </Card>
  //     <Card className="flex-1 shadow-none">
  //       <CardHeader>
  //         <CardTitle>Subreddits</CardTitle>
  //         <CardDescription>Manage your subreddits here.</CardDescription>
  //       </CardHeader>
  //       <CardContent>
  //         <SubredditForm subreddits={subreddits} />
  //       </CardContent>
  //     </Card>
  //     <Card className="flex-1 shadow-none">
  //       <CardHeader>
  //         <CardTitle>Email</CardTitle>
  //         <CardDescription>
  //           Control how to receive email notification here.
  //         </CardDescription>
  //       </CardHeader>
  //       <CardContent>
  //         <EmailForm email={user.email!} />
  //       </CardContent>
  //     </Card>
  //   </div>
  // );
}
