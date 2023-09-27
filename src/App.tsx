import * as React from "react";
import { Center, Flex, Img, Stack } from "@chakra-ui/react";
import InfiniteBanner from "./InfiniteBanner";
import { useClock } from "./hooks";
import { Camera, CameraTarget, useCamera, utils } from "./camera";

const bannerOneImages = [
  "site-2.png",
  "site-4.jpeg",
  "site-5.jpeg",
  "site-7.jpeg",
  "site-8.png"
];

const bannerTwoImages = [
  "site-10.jpeg",
  "site-11.jpeg",
  "site-13.jpeg",
  "site-14.jpeg",
  "site-15.jpeg"
];

const Photo = ({ src, alt, onClick }) => {
  const ref = React.useRef<utils.CameraTarget>(null);

  return (
    <CameraTarget ref={ref}>
      <Img
        tabIndex={0}
        src={src}
        alt={alt}
        onClick={() => {
          onClick(ref.current);
        }}
        cursor="pointer"
        w="20vw"
        h="20vh"
        objectFit="cover"
        border="6px solid white"
      />
    </CameraTarget>
  );
};

const Banners = () => {
  const camera = useCamera();
  const [target, setTarget] = React.useState<utils.CameraTarget>(null);
  const clock = useClock({
    defaultValue: Date.now(),
    reverse: false
  });
  const reverseClock = useClock({
    defaultValue: Date.now(),
    reverse: true
  });

  React.useEffect(() => {
    if (target) {
      camera.follow(target);
      camera.setZoom(4);
      camera.setRotation(0);
      clock.stop();
      reverseClock.stop();
    } else {
      camera.panTo(new utils.Vector(0, 0));
      camera.setZoom(1);
      camera.setRotation(-10);
      clock.start();
      reverseClock.start();
    }
    return () => {
      if (target) camera.unfollow(target);
    };
  }, [camera, target, clock, reverseClock]);

  return (
    <Stack spacing={6}>
      <InfiniteBanner clock={clock.value}>
        <Flex gap={6} pr={6}>
          {bannerOneImages.map((img) => (
            <Photo
              key={img}
              src={img}
              alt={img}
              onClick={(t) => setTarget((prev) => (prev !== t ? t : null))}
            />
          ))}
        </Flex>
      </InfiniteBanner>
      <InfiniteBanner clock={reverseClock.value}>
        <Flex gap={6} pr={6}>
          {bannerTwoImages.map((img) => (
            <Photo
              key={img}
              src={img}
              alt={img}
              onClick={(t) => setTarget((prev) => (prev !== t ? t : null))}
            />
          ))}
        </Flex>
      </InfiniteBanner>
    </Stack>
  );
};

const App = () => {
  return (
    <Camera h="100vh" bg="black">
      <Center h="100%" transform="scale(1.25)">
        <Banners />
      </Center>
    </Camera>
  );
};

export default App;
