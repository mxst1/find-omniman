const areYouSure = new Audio("./assets/are-you-sure.mp3");
const distortedAreYouSure = new Audio("./assets/distorted-are-you-sure.mp3");
const prettySure = new Audio("./assets/prettysure.mp3");
areYouSure.loop = true;
distortedAreYouSure.loop = true;

if (!window.localStorage.getItem("points")) {
	window.localStorage.setItem("points", 0);
}

document.getElementById(
	"points"
).innerText = `Points: ${window.localStorage.getItem("points")}`;

const addPoint = async () => {
	window.localStorage.setItem(
		"points",
		Number(window.localStorage.getItem("points")) + 1
	);
};

const randomPos = async (imageWidth, imageHeight) => {
	let randomWidth = Math.floor(
		Math.random() * (window.innerWidth - imageWidth)
	);
	let randomHeight = Math.floor(
		Math.random() * (window.innerHeight - imageHeight)
	);

	return { rWidth: randomWidth, rHeight: randomHeight };
};

const startChallenge = async () => {
	let time = 0;

	const timer = setInterval(() => {
		time++;
	}, 10);

	document.getElementById("start-container").style.display = "none";
	let omniman = document.createElement("img");
	omniman.setAttribute(
		"src",
		"https://us-tuna-sounds-images.voicemod.net/13e358e4-8406-4d0a-a724-b89c38e64a0a-1701486070717.jpg"
	);
	omniman.setAttribute("width", "100px");
	omniman.style.opacity = 0.019;
	omniman.style.position = "fixed";

	// Wait for the image to load before setting position
	omniman.onload = async () => {
		const { rWidth, rHeight } = await randomPos(omniman.width, omniman.height);
		omniman.style.left = `${rWidth}px`;
		omniman.style.top = `${rHeight}px`;
	};

	omniman.id = "omniman";
	document.body.appendChild(omniman);

	areYouSure.play();

	omniman.addEventListener("click", async () => {
		clearInterval(timer);
		let startContainer = document.getElementById("start-container");
		startContainer.style.display = "flex";
		window.removeEventListener("mousemove", handleMouseMove);
		areYouSure.pause();
		areYouSure.currentTime = 0;
		distortedAreYouSure.pause();
		distortedAreYouSure.currentTime = 0;
		prettySure.play();
		document.getElementById("title-question").style.display = "none";
		document.getElementById("start-button").style.display = "none";
		document.getElementById("points").style.display = "none";
		startContainer.style.backgroundImage =
			"url(https://us-tuna-sounds-images.voicemod.net/13e358e4-8406-4d0a-a724-b89c38e64a0a-1701486070717.jpg)";
		startContainer.style.backgroundSize = "cover";
		startContainer.style.backgroundPosition = "center";
		startContainer.style.backgroundRepeat = "no-repeat";
		await new Promise((resolve) => setTimeout(resolve, 2000));
		omniman.remove();
		startContainer.style.background = "";
		document.getElementById("title-question").style.display = "flex";
		document.getElementById("start-button").style.display = "flex";
		document.getElementById("points").style.display = "flex";
		document.getElementById(
			"title-question"
		).innerText = `You found Omniman!\nTook you ${
			time.toFixed(2) / 100
		} seconds.`;
		document.getElementById("start-button").style.display = "flex";
		document.getElementById("start-button").innerText = "Again?";
		await addPoint();
		document.getElementById(
			"points"
		).innerText = `Points: ${window.localStorage.getItem("points")}`;
	});

	let currentSound = null;

	const fadeAudioToVolume = (audio, targetVolume, duration = 300) => {
		const startVolume = audio.volume;
		const startTime = performance.now();

		const step = (now) => {
			const elapsed = now - startTime;
			const progress = Math.min(elapsed / duration, 1);
			audio.volume = startVolume + (targetVolume - startVolume) * progress;

			if (progress < 1) {
				requestAnimationFrame(step);
			} else if (targetVolume === 0) {
				audio.pause();
			}
		};

		requestAnimationFrame(step);
	};

	const handleMouseMove = (e) => {
		const omnimanRect = omniman.getBoundingClientRect();
		const omnimanCenterX = omnimanRect.left + omnimanRect.width / 2;
		const omnimanCenterY = omnimanRect.top + omnimanRect.height / 2;
		const mouseX = e.clientX;
		const mouseY = e.clientY;
		const dx = mouseX - omnimanCenterX;
		const dy = mouseY - omnimanCenterY;
		const distance = Math.sqrt(dx * dx + dy * dy);

		const maxDistance = 1000;
		const minDistance = 100;

		let targetAudio = null;

		if (distance >= maxDistance) {
			targetAudio = null;
		} else if (distance <= minDistance) {
			targetAudio = distortedAreYouSure;
		} else {
			targetAudio = areYouSure;
		}

		let targetVolume = 0;
		if (targetAudio === distortedAreYouSure) {
			targetVolume = 1 - distance / minDistance;
		} else if (targetAudio === areYouSure) {
			targetVolume = 1 - (distance - minDistance) / (maxDistance - minDistance);
		}

		if (targetAudio !== currentSound) {
			if (currentSound) fadeAudioToVolume(currentSound, 0, 200);
			if (targetAudio) {
				targetAudio.currentTime = 0;
				targetAudio.play();
				fadeAudioToVolume(targetAudio, targetVolume, 200);
			}
			currentSound = targetAudio;
		} else if (currentSound) {
			currentSound.volume = targetVolume;
		}
	};

	window.addEventListener("mousemove", handleMouseMove);
};
