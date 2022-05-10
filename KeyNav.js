/*
KeyNav v0.2.1
	css classes - elem :        nav-line nav-elem active
	css classes - section :     nav-section active
	KeyCodes --->   L-CTRL:17   R-CTRL:17   L-SHIFT:16  L-ALT:18    R-ALT:18    L-WIN:91    TAB:9   CAPS-LOCK:20    ²:222
									
									[AZERTY] Z:90 Q:81 S:83 D:68
									[QWERTY] W:87 A:65 S:83 D:68
									SPACE:32    ENTER:13    LEFT:37     UP:38   RIGHT:39    DOWN:40     8:BACKSPACE     ECHAP:27
									PAGEUP:33   PAGEDOWN:34  HOME:36     END:37     DELETE:46   INSER:45
									AUDIO-MUTE:173  AUDIO(-):174    AUDIO(+):175    STOP:178    PLAY-PAUSE:179  PREVIOUS:177    NEXT:176
*/
export default class KeyNav {
	/*
					section : container IDs
					options : keep 'y' value when 'x' is changing
	*/
	constructor(section, options = {}, callback = function() {}) {
	// Init properties
		this.options = {};
		this.history = [];
		this.historyIndex = -1;
		this.keypressHistory = [];
		this.section = "";

		this.callback = callback;

		this.x = 0;
		this.y = 0;
		this.xLength = 0;
		this.yLength = 0;
		this.xElements = null;
		this.yElements = null;

		this.level = 0;

		this.sectionElement = null;

		// Events
		this.eventUp = new CustomEvent("navUp", {
			detail: { x: this.x, y: this.y }
		});
		this.eventDown = new CustomEvent("navDown", {
			detail: { x: this.x, y: this.y }
		});
		this.eventLeft = new CustomEvent("navLeft", {
			detail: { x: this.x, y: this.y }
		});
		this.eventRight = new CustomEvent("navRight", {
			detail: { x: this.x, y: this.y }
		});

		// CSS classes
		this.classSection = "section";
		this.classNavElementX = "nav-x";
		this.classNavElementY = "nav-y";

		this.classSectionFocus = "focus";
		this.classNavActive = "active";

		// Init OBJ
		this.initOptions(options);
		this.initSection(section, 0, 0);

		// Start KeyPress Event Listener
		this.eventKeyPress();
	}

	eventKeyPress() {
		window.addEventListener("keydown", e => {
			const pkey = e.keyCode;
			let callbAction = 0;
			let refKey = false;

			// UP
			if (pkey === 90 || pkey === 38) {
				refKey = true;
				this.keypressHistory.push("UP");
				if(this.options.direction === 'x') this.goPrevY();
				else if(this.options.direction === 'y')  this.goPrevX();
				this.eventUp = new CustomEvent("navUp", {
					detail: { x: this.x, y: this.y }
				});
				document.dispatchEvent(this.eventUp);
			}
			// DOWN
			else if (pkey === 83 || pkey === 40) {
				refKey = true;
				this.keypressHistory.push("DOWN");
				if(this.options.direction === 'x') this.goNextY();
				else if(this.options.direction === 'y')  this.goNextX();
				this.eventDown = new CustomEvent("navDown", {
					detail: { x: this.x, y: this.y }
				});
				document.dispatchEvent(this.eventDown);
			}
			// LEFT
			else if (pkey === 81 || pkey === 37) {
				refKey = true;
				this.keypressHistory.push("LEFT");
				if(this.options.direction === 'x') this.goPrevX();
				else if(this.options.direction === 'y')  this.goPrevY();
				this.eventLeft = new CustomEvent("navLeft", {
					detail: { x: this.x, y: this.y }
				});
				document.dispatchEvent(this.eventLeft);
			}
			// RIGHT
			else if (pkey === 68 || pkey === 39) {
				refKey = true;
				this.keypressHistory.push("RIGHT");
				if(this.options.direction === 'x') this.goNextX();
				else if(this.options.direction === 'y')  this.goNextY();
				this.eventRight = new CustomEvent("navRight", {
					detail: { x: this.x, y: this.y }
				});
				document.dispatchEvent(this.eventRight);
			}
			// ENTER
			else if (pkey === 32 || pkey === 13) {
				this.keypressHistory.push("ENTER");
			}
			// BACK
			else if (pkey === 8 || pkey === 27) {
				this.keypressHistory.push("BACK");
			}

			if (refKey) this.callback(this);

			return callbAction;
		});
	}

	initOptions(options) {
	// Return to first element at the end
		if (options.loop !== undefined) {
			this.options.loop = options.loop;
		} else {
			this.options.loop = true;
		}
		// Return to first element while changing line
		if (options.cr !== undefined) {
			this.options.cr = options.cr;
		} else {
			this.options.cr = false;
		}
		// Navigation direction
		this.options.direction = options.direction !== 'x' && options.direction !== 'y' ? 'x' : options.direction
	}

	initSection(section, x, y, pushHistory = true) {
		this.section = section;
		this.x = x;
		this.y = y;

		if (pushHistory === true) {
			this.historyIndex++;
			this.history.push({
				section: section,
				index: this.historyIndex,
				x: this.x,
				y: this.y
			});
		}

		this.sectionElement = document.getElementById(section);
		this.yElements = this.sectionElement.getElementsByClassName(
			this.classNavElementY
		);
		this.xElements = this.yElements[this.y].getElementsByClassName(
			this.classNavElementX
		);
		this.yLength = this.yElements.length;
		this.xLength = this.xElements.length;

		// Init CSS classes
		try {
			document
				.getElementsByClassName(this.classSectionFocus)[0]
				.classList.remove(this.classSectionFocus);
		} catch (err) {
		// First occurence comes here
		}

		this.sectionElement.classList.add(this.classSectionFocus);

		this.yElements[this.y].classList.add(this.classNavActive);
		this.xElements[this.x].classList.add(this.classNavActive);
	}

	goNextY() {
		if (this.y + 1 < this.yLength) this.y++;
		else return;

		this.yElements[this.y - 1].classList.remove(this.classNavActive);
		this.yElements[this.y].classList.add(this.classNavActive);

		// X positioning
		this.xElements[this.x].classList.remove(this.classNavActive);
		// if (false) this.x = 0;
		this.xElements = this.yElements[this.y].getElementsByClassName(
			this.classNavElementX
		);
		this.xLength = this.xElements.length;
		if (this.options.cr === true) this.x = 0;
		else if (this.x >= this.xLength) this.x = this.xLength - 1;
		this.xElements[this.x].classList.add(this.classNavActive);
	}

	goPrevY() {
		if (this.y - 1 >= 0) this.y--;
		else return;

		this.yElements[this.y + 1].classList.remove(this.classNavActive);
		this.yElements[this.y].classList.add(this.classNavActive);

		// X positioning
		this.xElements[this.x].classList.remove(this.classNavActive);
		this.xElements = this.yElements[this.y].getElementsByClassName(
			this.classNavElementX
		);
		this.xLength = this.xElements.length;
		if (this.options.cr === true) this.x = 0;
		else if (this.x >= this.xLength) this.x = this.xLength - 1;
		this.xElements[this.x].classList.add(this.classNavActive);
	}

	goNextX() {
		const currentX = this.x;
		if (currentX + 1 < this.xLength || this.options.loop)
			this.x = (this.x + 1) % this.xLength;
		else return;

		this.xElements[currentX].classList.remove(this.classNavActive);
		this.xElements[this.x].classList.add(this.classNavActive);
	}

	goPrevX() {
		const currentX = this.x;
		if (this.x - 1 >= 0 || this.options.loop)
			this.x = (this.x - 1 + this.xLength) % this.xLength;
		else return;

		this.xElements[currentX].classList.remove(this.classNavActive);
		this.xElements[this.x].classList.add(this.classNavActive);
	}

	goToSection(sectionId) {
		if (document.getElementById(sectionId) !== null) {
			this.history[this.historyIndex].x = this.x;
			this.history[this.historyIndex].y = this.y;
			this.sectionElement.classList.remove(this.classSectionFocus);
			this.initSection(sectionId, 0, 0);
		}
	}

	goBack() {
		if (this.history.length > 1) {
			this.sectionElement
				.getElementsByClassName(
					this.classNavElementX + " " + this.classNavActive
				)[0]
				.classList.remove(this.classNavActive);
			this.sectionElement
				.getElementsByClassName(
					this.classNavElementY + " " + this.classNavActive
				)[0]
				.classList.remove(this.classNavActive);
			this.sectionElement.classList.remove(this.classSectionFocus);

			this.history.splice(this.historyIndex, 1);
			this.historyIndex--;

			this.initSection(
				this.history[this.historyIndex].section,
				this.history[this.historyIndex].x,
				this.history[this.historyIndex].y,
				false
			);
		}
	}
}
