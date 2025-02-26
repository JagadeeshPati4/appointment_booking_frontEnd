import React, { useCallback, useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import useEmblaCarousel from "embla-carousel-react";
import { useMediaQuery } from "@mui/material";

const images = [
  "https://r.mobirisesite.com/1235201/assets/images/photo-1470116945706-e6bf5d5a53ca.jpeg",
  "https://r.mobirisesite.com/1235201/assets/images/photo-1571772996211-2f02c9727629.jpeg",
  "https://r.mobirisesite.com/1235201/assets/images/photo-1576091160501-bbe57469278b.jpeg",
  "https://r.mobirisesite.com/1235201/assets/images/photo-1554734867-bf3c00a49371.jpeg",
  "https://r.mobirisesite.com/1235201/assets/images/photo-1618498082410-b4aa22193b38.jpeg",
  "https://img.freepik.com/free-photo/young-handsome-physician-medical-robe-with-stethoscope_1303-17818.jpg?t=st=1740514258~exp=1740517858~hmac=23494acfd3f32bedc1a5d839fd2e5a779177f0e5fef2a016dda637f8074a8a89&w=1060",
  "https://img.freepik.com/premium-photo/modern-equipment-operating-room-medical-devices-neurosurgery_179755-870.jpg?w=1060",
  "https://img.freepik.com/free-photo/man-woman-wearing-scientist-uniform-working-laboratory_839833-25786.jpg?t=st=1740514318~exp=1740517918~hmac=bb7964056770a2fd99dfed61dbcf637b394e8bf18ae09244fc3e35320047215c&w=1060",
];

const ImageSlider = () => {
  // Media queries for responsive slides
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:600px) and (max-width:960px)");
  const isLaptop = useMediaQuery("(min-width:960px) and (max-width:1280px)");
  const isDesktop = useMediaQuery("(min-width:1280px)");

  // Determine how many slides should be visible based on screen size
  const slidesToShow = isMobile ? 1 : isTablet ? 2 : isLaptop ? 5 : 6;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, slidesToScroll: 1 }); // Scroll one image at a time
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit(); // Reinitialize when slide count changes
    emblaApi.on("select", updateScrollButtons);
    updateScrollButtons();

    // Auto-scroll every 3 seconds (one image at a time)
    const autoScroll = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, 3000);

    return () => clearInterval(autoScroll); // Cleanup on unmount
  }, [emblaApi, updateScrollButtons, slidesToShow]);

  return (
    <Box sx={{ position: "relative", width: "100%", overflow: "hidden", borderRadius: 2 }}>
      <Box ref={emblaRef} sx={{ overflow: "hidden", width: "100%" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          {images.map((src, index) => (
            <Box
              key={index}
              sx={{
                flex: `0 0 ${100 / slidesToShow}%`, // Adjust width dynamically
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 1,
              }}
            >
              <img src={src} alt={`Slide ${index}`} style={{ width: "100%", borderRadius: "8px" }} />
            </Box>
          ))}
        </Box>
      </Box>

      {canScrollPrev && (
        <IconButton
          onClick={() => emblaApi && emblaApi.scrollPrev()}
          sx={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.5)", color: "white" }}
        >
          <ArrowBackIos />
        </IconButton>
      )}
      {canScrollNext && (
        <IconButton
          onClick={() => emblaApi && emblaApi.scrollNext()}
          sx={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.5)", color: "white" }}
        >
          <ArrowForwardIos />
        </IconButton>
      )}
    </Box>
  );
};

export default ImageSlider;
