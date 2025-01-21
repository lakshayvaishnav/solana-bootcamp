fn main() {
    // let nickel = Coin::Nickel;
    // value_in_cents(nickel);
    // let value: Option<i32> = None;
    // let result = plus_one(value);
    // println!("the result is : {:?}", result);
    catch_all_values(Coin::Nickel);

}



#[derive(Debug)]
enum Coin {
    Penny,
    Dime,
    Nickel,
    Quarter,
}

// fn value_in_cents(coin: Coin) {
//     match coin {
//         Coin::Dime => println!("dime"),
//         Coin::Penny => println!("penny"),
//         Coin::Nickel => println!("nickel"),
//         Coin::Quarter => println!("quarter"),
//     }
// }

// fn plus_one(x: Option<i32>) -> Option<i32> {
//     match x {
//         Some(value) => Some(value + 1),
//         None => None,
//     }
// }

fn catch_all_values(coin: Coin) {
    match coin {
        Coin::Dime => println!("the coin is dime"),
        other => println!("doesn't care about others : {:?}",other),
    }
}
