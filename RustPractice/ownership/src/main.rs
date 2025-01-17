fn main() {
    let s1 = String::from("hii this is s1");

    let s2 = s1; // ownership of s1 is transfered to s2
                 // println!("s1 : {s1}"); // cannot access s1 now cause it is moved to s2
    println!("s2 : {s2}");
}
