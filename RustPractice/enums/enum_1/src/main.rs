#[derive(Debug)]
enum Ipaddr {
    V4(String),
    V2(String),
    V3,
}

fn main() {
    let home = Ipaddr::V2(String::from("1.2.3.4"));
    let office = Ipaddr::V4(String::from("::1"));
    let choice3 = Ipaddr::V3;

    println!("the home ipaddress is -> {:#?}", home);
    println!("the office ipaddress is -> {:#?}", office);
    println!("the choice 3  is -> {:#?}", choice3);
}
