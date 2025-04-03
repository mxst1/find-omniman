const areYouSure = new Audio("./assets/are-you-sure.mp3");
const distortedAreYouSure = new Audio("./assets/distorted-are-you-sure.mp3");
const prettySure = new Audio("./assets/prettysure.mp3");

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

	areYouSure.loop = true;
	distortedAreYouSure.loop = true;

	// Start playing the main audio after the context resumes
	areYouSure.play();

	omniman.addEventListener("click", async () => {
		clearInterval(timer);
		document.getElementById("start-container").style.display = "flex";
		omniman.remove();
		document.getElementById("title-question").innerText = "You found Omniman!";
		document.getElementById("start-button").innerText = "Again?";
		window.removeEventListener("mousemove", handleMouseMove);
		areYouSure.pause();
		areYouSure.currentTime = 0;
		distortedAreYouSure.pause();
		distortedAreYouSure.currentTime = 0;
		await addPoint();
		document.getElementById(
			"points"
		).innerText = `Points: ${window.localStorage.getItem("points")}`;
		prettySure.play();
	});

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

		if (distance > maxDistance) {
			if (!areYouSure.paused) areYouSure.pause();
			if (!distortedAreYouSure.paused) distortedAreYouSure.pause();
		} else if (distance < minDistance) {
			if (areYouSure.playing) {
				areYouSure.pause();
				areYouSure.currentTime = 0;
			}
			if (distortedAreYouSure.paused) {
				distortedAreYouSure.currentTime = 0;
				distortedAreYouSure.play();
			}
		} else if (distance > minDistance) {
			if (areYouSure.paused) areYouSure.play();
			if (!distortedAreYouSure.paused) distortedAreYouSure.pause();
		} else {
			if (distortedAreYouSure.playing) {
				distortedAreYouSure.pause();
				distortedAreYouSure.currentTime = 0;
			}
			if (areYouSure.paused) areYouSure.play();
			areYouSure.volume =
				1 - (distance - minDistance) / (maxDistance - minDistance);
		}
	};

	window.addEventListener("mousemove", handleMouseMove);
};
