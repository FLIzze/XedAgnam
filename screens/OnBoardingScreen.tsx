import { logo } from "@/assets/images";
import Box from "@/components/common/Box";
import OnBoardingSlide from "@/components/OnboardingSlide";
import theme from "@/theme";
import { Image, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native";

export default function OnBoardingScreen() {
  const { width, height } = useWindowDimensions();
  const slides = [
    {
      title: "Explore un univers infini de mangas.",
      subtitle:
        "Découvre des histoires captivantes, des héros inoubliables et des aventures sans fin. Tout est à portée de swipe.",
    },
    {
      title: "Lis sans interruption, à ton rythme.",
      subtitle:
        "Profite d’une expérience fluide et optimisée pour la lecture verticale. Le confort, c’est notre priorité.",
    },
    {
      title: "Ne perds jamais le fil.",
      subtitle:
        "Ajoute tes mangas préférés en favoris et reprends ta lecture exactement où tu l’as laissée.",
    },
    {
      title: "Prêt à plonger dans l’aventure ?",
      subtitle: "Commencer",
    },
  ];

  return (
    <Box flex={1} backgroundColor="background">
      <ScrollView
        horizontal
        pagingEnabled
        style={{ backgroundColor: theme.colors.background }}
        showsHorizontalScrollIndicator={false}
      >
        {slides.map((slide, index) => (
          <OnBoardingSlide
            title={slide.title}
            subtitle={slide.subtitle}
            index={index}
            key={index}
          />
        ))}
      </ScrollView>
      <Image
        source={logo}
        style={{
          width: 250,
          height: 250,
          position: "absolute",
          top: "25%",
          left: width / 6,
        }}
      />
    </Box>
  );
}
