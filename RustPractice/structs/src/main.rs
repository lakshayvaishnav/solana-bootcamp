#[derive(Debug)]
struct User {
    name: String,
    email: String,
    age: u32,
}

fn main() {
    let user1 = User {
        name: String::from("lakshay vaishnav"),
        email: String::from("thelakshayvaishnav@gmail.com"),
        age: 23,
    };

    let mut user2 = User {
        name: String::from("lxsh"),
        ..user1
    };

    user2.email = String::from("lxsh@gmail.com"); // updating the value

    fn build_user(email: String, name: String) -> User {
        User {
            email,
            name,
            age: 23,
        }
    }

    let user3 = build_user(String::from("user3@gmail.com"), String::from("papadon"));

    println!("the user 3 is : {:#?}", user3);

    println!("the name is : {}", user1.name);
    // println!("the whole struct is : {:?}", user1); -> this will not be valid since value moved to user2.
    println!("the whole struct is #: {:#?}", user2);

    println!("Hello, world!");
}
