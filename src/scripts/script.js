const gameArea = document.querySelector('.game-area');
const cards = document.querySelectorAll('.card');
const resetButton = document.querySelector('.reset');

let firstActiveCard = null;
let secondActiveCard = null;

let cnt = 0;

const svgS = [
	'candy',
	'cheers',
	'donut',
	'hamburger',
	'ice-cream',
	'juice',
	'sausage',
	'wine',
];

function insertSVGsIntoCards() {
	const svgPairs = [...svgS, ...svgS].sort(() => Math.random() - 0.5);

	cards.forEach((card, i) => {
		const img = document.createElement('img');
		img.src = `../assets/images/${svgPairs[i]}.svg`;
		img.className = 'card-img hidden';
		img.alt = `${svgPairs[i]}`;

		card.appendChild(img);
	});
}
insertSVGsIntoCards();

function toggleCardImages(card) {
	const [questionMarkImg, foodImg] = [card.firstElementChild, card.lastElementChild];

	setTimeout(() => {
		foodImg.classList.toggle('hidden');
		questionMarkImg.classList.toggle('hidden');
	}, 250);
}

gameArea.addEventListener('click', function (e) {
	const clickedCard = e.target?.closest('.card');

	if (
		!clickedCard ||
		clickedCard === firstActiveCard ||
		clickedCard === secondActiveCard ||
		clickedCard.classList.contains('success')
	) {
		return;
	}

	if (firstActiveCard && secondActiveCard) {
		[firstActiveCard, secondActiveCard].forEach((card) => {
			toggleCardImages(card);
			card.classList.remove('flip-vertical-right');
		});

		firstActiveCard = null;
		secondActiveCard = null;
	}

	if (!firstActiveCard) {
		firstActiveCard = clickedCard;
		firstActiveCard.classList.add('flip-vertical-right');
		toggleCardImages(firstActiveCard);
	} else if (!secondActiveCard) {
		secondActiveCard = clickedCard;
		secondActiveCard.classList.add('flip-vertical-right');
		toggleCardImages(secondActiveCard);
	}

	if (firstActiveCard && secondActiveCard) {
		const [foodImg1, foodImg2] = [
			firstActiveCard.lastElementChild,
			secondActiveCard.lastElementChild,
		];

		if (foodImg1.src === foodImg2.src) {
			setTimeout(() => {
				[firstActiveCard, secondActiveCard].forEach((card) => {
					card.classList.add('success', 'popup');
				});

				firstActiveCard = null;
				secondActiveCard = null;
			}, 500);

			if (++cnt === 8) {
				setTimeout(() => {
					gameArea.classList.add('hanging');

					setTimeout(resetGame, 4000);
				}, 1000);
				cnt = 0;
			}
		}
	}
});

resetButton.addEventListener('click', resetGame);

function resetGame() {
	firstActiveCard = null;
	secondActiveCard = null;

	cards.forEach((card) => {
		card.classList.remove('success', 'flip-vertical-right', 'popup');

		card.firstElementChild.classList.remove('hidden');

		card.removeChild(card.lastElementChild);
	});

	setTimeout(insertSVGsIntoCards, 250);

	gameArea.classList.remove('rollin', 'hanging');

	setTimeout(() => gameArea.classList.add('rollin'), 0);
}
