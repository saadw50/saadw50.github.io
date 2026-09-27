// Boards shown in the "PCB design" section, in display order. The grid takes any number of cards.
//
// TO ADD A BOARD
//   1. Put the photo in public/images/, for example public/images/board_buck.jpg (JPEG, any size).
//   2. Add { name: "board_buck", widths: [480, 800, 1200] } to JOBS in scripts/make-images.mjs,
//      then run `npm run images` to make the smaller copies phones download.
//   3. Copy this template into BOARDS below and fill it in. Only state facts you can show.
//
//   {
//     id: "buck",
//     kicker: "Power · DC-DC",                  // small copper label above the title
//     title: "Synchronous buck converter",
//     text: "One or two sentences: what the board does and one design decision you made.",
//     chips: ["2-layer", "KiCad"],               // short facts shown as chips
//     photo: {
//       name: "board_buck",                      // file name without .jpg
//       alt: "What the photo shows, for screen readers",
//       caption: "Caption shown when the photo is enlarged",
//       focus: "50% 50%",                        // which part stays visible in the 16:10 crop
//     },
//   },
//
// A board with no approved photo can use `diagram: "stackup"` instead of `photo`.

export type Board = {
  id: string;
  kicker: string;
  title: string;
  text: string;
  note?: string;
  chips: string[];
  photo?: { name: string; alt: string; caption: string; focus?: string };
  diagram?: "stackup";
};

export const BOARDS: Board[] = [
  {
    id: "tx",
    kicker: "Ultrasonic array · transmit",
    title: "8-channel transmit board",
    text: "Eight 40 kHz transducers in one row, each switched by its own MOSFET channel with a pull-down, driven from the ESP32 over a ribbon cable.",
    chips: ["8 channels", "TO-220 MOSFETs", "Through-hole"],
    photo: {
      name: "board_tx",
      alt: "Blue PCB with a row of eight silver ultrasonic transducers above eight TO-220 MOSFETs and rows of resistors",
      caption: "8-channel transmit board: eight 40 kHz transducers, each switched by its own MOSFET channel.",
      focus: "50% 40%",
    },
  },
  {
    id: "rx",
    kicker: "Ultrasonic array · receive",
    title: "Receive front-end board",
    text: "One 40 kHz receiver with TL072 conditioning, envelope detection and on-board regulation, kept on its own board, away from the switching transmit channels.",
    chips: ["TL072", "Envelope detector", "Split from TX"],
    photo: {
      name: "board_rx",
      alt: "Small blue PCB with one ultrasonic receiver, an 8-pin IC socket, a regulator and a large electrolytic capacitor",
      caption: "Receive front-end board: one 40 kHz receiver, TL072 conditioning, envelope detection and on-board regulation.",
      focus: "55% 45%",
    },
  },
  {
    id: "wristband",
    kicker: "Wearable · paid research work",
    title: "Stroke-risk wristband board",
    text: "A 46 × 36 mm four-layer board (signal, GND, 3.3 V, signal) with 86 parts: ESP32-S3, MAX30102 PPG, single-lead ECG front-end, MPU-6050 IMU, OLED, USB-C charging, microSD and a 500 mAh LiPo.",
    note: "The layout belongs to the research team, so this card shows a generic stack-up only.",
    chips: ["46 × 36 mm", "4-layer", "86 parts", "DRC clean"],
    diagram: "stackup",
  },
];
