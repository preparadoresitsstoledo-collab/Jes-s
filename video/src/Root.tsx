import { Composition, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { ControlEmpleo, DURACION_TOTAL } from "./ControlEmpleo";
import { FPS } from "./guion";

const PESOS: [string, string][] = [
  ["400", "Inter-Regular.otf"],
  ["600", "Inter-SemiBold.otf"],
  ["700", "Inter-Bold.otf"],
  ["800", "Inter-ExtraBold.otf"],
];
PESOS.forEach(([weight, file]) =>
  loadFont({ family: "Inter", url: staticFile(`fonts/${file}`), weight }),
);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="ControlEmpleoCafeteria"
    component={ControlEmpleo}
    durationInFrames={DURACION_TOTAL}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
