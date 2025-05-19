import { getAllBlogs } from "@/app/api/apiClient/apiClient";
import { BlogList } from "@/components/Main";


async function BogsSection({ locale }: { locale: string }) {

  const { blogs } = await getAllBlogs({
    page:1,
    limit:200,
    lang:locale,
    type:undefined,
    showInHome:true
  });

  return <BlogList blogs={blogs} />;
}

export default BogsSection;
