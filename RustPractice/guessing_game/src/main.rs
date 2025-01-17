use std::io;
use std::cmp::Ordering;
fn main() {
    println!("guessing the number");
    println!("please input your guess");
    let mut guess = String::new();
    io::stdin()
        .read_line(&mut guess)
        .expect("failed to read the number");

    println!("you guessed the number : {}", guess);
}
