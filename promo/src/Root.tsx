import { Composition } from "remotion";
import { Ad } from "./Ad";
import { Post } from "./Post";
import { Story } from "./Story";
import { Logo } from "./Logo";
import { Carousel } from "./Carousel";
import { DeptPost } from "./DeptPost";
import { Variant } from "./Variant";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Ad"
        component={Ad}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Post"
        component={Post}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="Story"
        component={Story}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Logo"
        component={Logo}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="Carousel"
        component={Carousel}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{ slide: 0 }}
      />
      <Composition
        id="DeptPost"
        component={DeptPost}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{ dept: "programming" }}
      />
      <Composition
        id="Variant"
        component={Variant}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{ variant: 0 }}
      />
    </>
  );
};
