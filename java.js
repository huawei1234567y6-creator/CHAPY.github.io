
// ==========================================
// REPRODUCTOR RGB CHAPY_YT
// ==========================================

const music = document.getElementById("bgMusic");
const player = document.getElementById("musicPlayer");
const playBtn = document.getElementById("playBtn");
const volumeBtn = document.getElementById("volumeBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeLabel = document.getElementById("currentTime");
const durationLabel = document.getElementById("duration");
const musicStatus = document.getElementById("musicStatus");
const particleLayer = document.getElementById("particleLayer");

if (
    music && player && playBtn && volumeBtn &&
    progressBar && particleLayer
) {
    let particleTimer = null;

    function formatTime(seconds) {
        if (!Number.isFinite(seconds)) return "0:00";

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return `${mins}:${String(secs).padStart(2, "0")}`;
    }

    function updatePlayerState() {
        const playing = !music.paused;

        player.classList.toggle("is-playing", playing);
        playBtn.textContent = playing ? "❚❚" : "▶";
        playBtn.setAttribute(
            "aria-label",
            playing ? "Pausar música" : "Reproducir música"
        );

        musicStatus.textContent = playing
            ? "REPRODUCIENDO AHORA"
            : "MÚSICA EN PAUSA";

        if (playing) {
            startParticles();
        } else {
            stopParticles();
        }
    }

    playBtn.addEventListener("click", async () => {
        if (music.paused) {
            try {
                await music.play();
            } catch (error) {
                musicStatus.textContent =
                    "NO SE PUDO CARGAR EL AUDIO";
                console.error("Error de reproducción:", error);
            }
        } else {
            music.pause();
        }
    });

    music.addEventListener("play", updatePlayerState);
    music.addEventListener("pause", updatePlayerState);
    music.addEventListener("ended", updatePlayerState);

    music.addEventListener("loadedmetadata", () => {
        durationLabel.textContent = formatTime(music.duration);
    });

    music.addEventListener("timeupdate", () => {
        currentTimeLabel.textContent = formatTime(music.currentTime);

        if (Number.isFinite(music.duration) && music.duration > 0) {
            progressBar.value =
                (music.currentTime / music.duration) * 100;
        }
    });

    progressBar.addEventListener("input", () => {
        if (Number.isFinite(music.duration) && music.duration > 0) {
            music.currentTime =
                (Number(progressBar.value) / 100) * music.duration;
        }
    });

    volumeBtn.addEventListener("click", () => {
        music.muted = !music.muted;

        volumeBtn.textContent = music.muted ? "🔇" : "🔊";
        volumeBtn.setAttribute(
            "aria-label",
            music.muted ? "Activar sonido" : "Silenciar música"
        );
    });

    // Genera destellos alrededor del disco mientras gira.
    function createParticle() {
        if (music.paused || document.hidden) return;

        const particle = document.createElement("span");
        particle.className = "rgb-particle";

        const colors = [
            "#00f7ff",
            "#4169ff",
            "#c000ff",
            "#ff28a7",
            "#39ff14",
            "#ffffff"
        ];

        const angle = Math.random() * Math.PI * 2;
        const distance = 25 + Math.random() * 38;
        const duration = 650 + Math.random() * 650;
        const size = 2 + Math.random() * 4;

        particle.style.setProperty(
            "--particle-x",
            `${50 + Math.cos(angle) * 35}%`
        );
        particle.style.setProperty(
            "--particle-y",
            `${50 + Math.sin(angle) * 35}%`
        );
        particle.style.setProperty(
            "--particle-dx",
            `${Math.cos(angle) * distance}px`
        );
        particle.style.setProperty(
            "--particle-dy",
            `${Math.sin(angle) * distance}px`
        );
        particle.style.setProperty(
            "--particle-color",
            colors[Math.floor(Math.random() * colors.length)]
        );
        particle.style.setProperty("--particle-size", `${size}px`);
        particle.style.setProperty("--particle-duration", `${duration}ms`);

        particleLayer.appendChild(particle);

        setTimeout(() => particle.remove(), duration + 100);
    }

    function startParticles() {
        if (particleTimer) return;

        particleTimer = setInterval(createParticle, 95);
    }

    function stopParticles() {
        clearInterval(particleTimer);
        particleTimer = null;
        particleLayer.replaceChildren();
    }

    // Evita mantener animaciones innecesarias en segundo plano.
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopParticles();
        } else if (!music.paused) {
            startParticles();
        }
    });

    music.addEventListener("error", () => {
        musicStatus.textContent = "REVISA LA RUTA DEL AUDIO";
    });

    updatePlayerState();
}
