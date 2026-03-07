const classic_button = document.getElementById("classic_button");
const mystery_button = document.getElementById("mystery_button");
const dice_roll_element = document.getElementById("dice_roll");
const available_numbers_element = document.getElementById("available_numbers");
const choices_remaining_element = document.getElementById("choices_remaining");
const end_game_button = document.getElementById("end_game_button");

const lowest_number = 2;
const highest_number = 12;
const midpoint_number = (lowest_number + highest_number) / 2;
const highest_odds = 6;
const roll_duration = 250;
const interval_time = 50;

let numbers = [];
let mode = null;

classic_button.onclick = () => classic_game();
mystery_button.onclick = () => mystery_game();
dice_roll_element.onclick = () => roll();
end_game_button.onclick = () => back_to_home_screen();

function classic_game() {
    mode = "classic";
    available_numbers_element.style.display = "block";
    initiate_game();
}

function mystery_game() {
    mode = "mystery";
    choices_remaining_element.style.display = "block";
    initiate_game();
}

function initiate_game() {
    classic_button.style.display = "none";
    mystery_button.style.display = "none";
    dice_roll_element.style.display = "flex";
    dice_roll_element.innerText = "?";
    end_game_button.style.display = "block";
    reset_numbers();
}

function back_to_home_screen() {
    mode = null;
    classic_button.style.display = "block";
    mystery_button.style.display = "block";
    dice_roll_element.style.display = "none";
    available_numbers_element.style.display = "none";
    choices_remaining_element.style.display = "none";
    end_game_button.style.display = "none";
}

function reset_numbers() {
    numbers = [];
    let counter = 0;
    for(let i = lowest_number; i <= highest_number; i++) {
        const amount = highest_odds - Math.abs(midpoint_number - i);
        for(let j = 0; j < amount; j++) {
            numbers.push({id: counter, value: i, used: false});
            counter++;
        }
    }
    update_display();
}

function get_available_numbers() {
    return numbers.filter(num => num.used == false);
}

function roll() {
    const available_numbers = get_available_numbers();
    const num_available = available_numbers.length;
    const random_index = Math.floor(Math.random() * num_available);
    const chosen_number = available_numbers[random_index];
    const chosen_id = chosen_number.id;

    const roller = setInterval(() => {
        dice_roll_element.textContent = Math.floor(Math.random() * 11) + 2;
    }, interval_time);
    setTimeout(() => {
        clearInterval(roller);
        numbers.find(num => num.id == chosen_id).used = true;
        dice_roll_element.innerText = chosen_number.value;
        if(num_available <= 1) reset_numbers();
        else update_display();
    }, roll_duration);
}

function update_display() {
    if(mode == "classic") update_available_numbers_element();
    else if(mode == "mystery") update_choices_remaining_element();
}

function update_available_numbers_element() {
    const size = 6;
    available_numbers_element.innerHTML = ""; 
    available_numbers_element.style.display = 'grid';
    available_numbers_element.style.gridTemplateColumns = `repeat(${size}, 15px)`;
    available_numbers_element.style.gridTemplateRows = `repeat(${size}, 15px)`;

    let grid_map = Array.from({ length: size }, () => Array(size).fill(null));

    let current_index = 0;
    for(let sum = 0; sum <= (size - 1) * 2; sum++) {
        for(let row = 0; row <= sum; row++) {
            let col = sum - row;
            if(row < size && col < size) {
                if(current_index < numbers.length) {
                    grid_map[row][col] = numbers[current_index];
                    current_index++;
                }
            }
        }
    }

    const flat_diagonal_data = grid_map.flat();

    flat_diagonal_data.forEach(num => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        if(num) {
            cell.textContent = num.value;
            if(num.used) cell.classList.add('used');
        }
        available_numbers_element.appendChild(cell);
    });
}

function update_choices_remaining_element() {
    const num_available_numbers = get_available_numbers().length;
    choices_remaining_element.innerHTML = `${num_available_numbers} roll${num_available_numbers == 1 ? "" : "s"} remaining`; 
}