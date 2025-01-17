fn main() {
    let word = String::from(" hello word");
    let value =first_word(&word);
    println!("the value is : {value}");

}

// fn first_word(s: &String) -> usize {
//     let in_bytes = s.as_bytes();

//     for (i, &item) in in_bytes.iter().enumerate() {
//         if item == b' ' {
//             return i;
//         }
//     }
//     s.len()
// }
// &str is a reference of a slice of the string.

fn first_word(s: &String) -> &str {
    let in_bytes = s.as_bytes();

    for (i, &item) in in_bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}
