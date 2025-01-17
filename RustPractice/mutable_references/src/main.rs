fn main() {
    let mut s1 = String::from("hello");
    let s2 = change_string(&mut s1); // s2 is the mutable reference
    
    println!("mutable refence : {s2}");
    let s3 = &s1; //  this is immutable reference;

    println!("immutable reference : {s3}");
}

fn change_string(s: &mut String) -> &String {
    s.push_str(" hey wassup");
    s
}
