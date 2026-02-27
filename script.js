const new_game_button = document.getElementById("new_game_button");
const dice_roll_element = document.getElementById("dice_roll");
const available_numbers_element = document.getElementById("available_numbers");
const end_game_button = document.getElementById("end_game_button");

const lowest_number = 2;
const highest_number = 12;
const midpoint_number = (lowest_number + highest_number) / 2;
const highest_odds = 6;

let numbers = [];

new_game_button.onclick = () => new_game();
dice_roll_element.onclick = () => roll();
end_game_button.onclick = () => back_to_home_screen();

function new_game() {
    new_game_button.style.display = "none";
    dice_roll_element.style.display = "flex";
    available_numbers_element.style.display = "block";
    end_game_button.style.display = "block";
    reset_numbers();
}

function back_to_home_screen() {
    new_game_button.style.display = "block";
    dice_roll_element.style.display = "none";
    available_numbers_element.style.display = "none";
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
    update_available_numbers_element();
}

function roll() {
    const available_numbers = numbers.filter(num => num.used == false);
    const num_available = available_numbers.length;
    const random_index = Math.floor(Math.random() * num_available);
    const chosen_number = available_numbers[random_index];
    const chosen_id = chosen_number.id;
    numbers.find(num => num.id == chosen_id).used = true;
    dice_roll_element.innerText = chosen_number.value;
    if(num_available <= 1) reset_numbers();
    else update_available_numbers_element();
}

function update_available_numbers_element() {
    const size = 6;
    available_numbers_element.innerHTML = ""; 
    available_numbers_element.style.display = 'grid';
    available_numbers_element.style.gridTemplateColumns = `repeat(${size}, 15px)`;
    available_numbers_element.style.gridTemplateRows = `repeat(${size}, 15px)`;

    let grid_map = Array.from({ length: size }, () => Array(size).fill(null));

    let current_index = 0;
    for (let sum = 0; sum <= (size - 1) * 2; sum++) {
        for (let row = 0; row <= sum; row++) {
            let col = sum - row;
            if (row < size && col < size) {
                if (current_index < numbers.length) {
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
            if (num.used) cell.classList.add('used');
        }
        available_numbers_element.appendChild(cell);
    });
}