"""Genera las voces del vídeo con Kokoro (TTS neuronal, sin conexión).

Uso:
    node --experimental-strip-types --no-warnings scripts/exportar-lineas.ts > /tmp/lineas.json
    python3 scripts/generar_voces.py /tmp/lineas.json /ruta/modelos-kokoro

Modelos (descargar una vez en /ruta/modelos-kokoro):
    https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
    https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin

Salida:
    public/voces/<id>.wav      un archivo por línea de diálogo
    src/voces.ts               duración y envolvente de cada línea para sincronizar labios y subtítulos
"""

import json
import os
import re
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SALIDA = os.path.join(RAIZ, "public", "voces")

# Reparto de voces: voz Kokoro, velocidad base, semitonos de ajuste
REPARTO = {
    "INSP": {"voz": "em_alex", "vel": 0.97, "semitonos": -0.5},
    "LUCIA": {"voz": "ef_dora", "vel": 1.02, "semitonos": 0.0},
    "RAMON": {"voz": "em_santa", "vel": 1.0, "semitonos": -1.5},
    "DANI": {"voz": "em_alex", "vel": 1.06, "semitonos": 2.5},
}

# Cómo debe pronunciarse lo que no se lee tal cual
PRONUNCIA = [
    (r"\bDNI\b", "de ene i"),
    (r"\bNIE\b", "nie"),
    (r"[«»]", ""),
    (r"…", ", "),
]


def preparar(texto: str) -> str:
    for patron, rep in PRONUNCIA:
        texto = re.sub(patron, rep, texto)
    return texto.strip()


def ajustar_tono(audio: np.ndarray, sr: int, semitonos: float) -> np.ndarray:
    if abs(semitonos) < 0.01:
        return audio
    r = 2 ** (semitonos / 12)
    with tempfile.TemporaryDirectory() as d:
        ent, sal = os.path.join(d, "a.wav"), os.path.join(d, "b.wav")
        sf.write(ent, audio, sr)
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", ent, "-af", f"asetrate={sr * r:.0f},aresample={sr},atempo={1 / r:.5f}", sal],
            check=True,
        )
        out, _ = sf.read(sal, dtype="float32")
    return out


def main() -> None:
    lineas = json.load(open(sys.argv[1], encoding="utf-8"))
    modelos = sys.argv[2]
    k = Kokoro(os.path.join(modelos, "kokoro-v1.0.onnx"), os.path.join(modelos, "voices-v1.0.bin"))
    os.makedirs(SALIDA, exist_ok=True)

    duraciones = {}
    for l in lineas:
        cfg = REPARTO[l["quien"]]
        vel = cfg["vel"]
        if l["quien"] == "RAMON" and l["tension"] >= 0.8:
            vel += 0.08  # el enfado acelera
        if l["quien"] == "LUCIA" and l["tension"] >= 0.5:
            vel += 0.04  # nervios
        audio, sr = k.create(preparar(l["texto"]), voice=cfg["voz"], speed=vel, lang="es")
        audio = ajustar_tono(np.asarray(audio, dtype="float32"), sr, cfg["semitonos"])
        # recorta silencios de los extremos y normaliza el nivel
        voz = np.where(np.abs(audio) > 0.01)[0]
        if len(voz):
            audio = audio[max(0, voz[0] - int(0.03 * sr)) : voz[-1] + int(0.08 * sr)]
        rms = float(np.sqrt(np.mean(audio**2))) or 1.0
        audio = np.clip(audio * (0.1 / rms), -0.98, 0.98)
        if l["quien"] == "RAMON" and l["tension"] >= 0.8:
            audio = np.clip(audio * 1.25, -0.98, 0.98)
        sf.write(os.path.join(SALIDA, f"{l['id']}.wav"), audio, sr, subtype="PCM_16")
        # envolvente por fotograma (30 fps) para mover la boca
        paso = sr // 30
        env = [float(np.sqrt(np.mean(audio[i : i + paso] ** 2))) for i in range(0, len(audio), paso)]
        tope = max(env) or 1.0
        duraciones[l["id"]] = {"dur": round(len(audio) / sr, 3), "env": [round(min(1.0, e / (tope * 0.7)), 2) for e in env]}
        print(f"{l['id']:7s} {l['quien']:6s} {duraciones[l['id']]['dur']:5.2f}s  {l['texto'][:60]}")

    ts = "// Generado por scripts/generar_voces.py. No editar a mano.\n"
    ts += "export const VOCES: Record<string, { dur: number; env: number[] }> = " + json.dumps(duraciones, separators=(",", ":")) + ";\n"
    open(os.path.join(RAIZ, "src", "voces.ts"), "w", encoding="utf-8").write(ts)


if __name__ == "__main__":
    main()
