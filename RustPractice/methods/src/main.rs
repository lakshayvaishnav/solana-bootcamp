#[derive(Debug)]
struct Rectange {
    width: u32,
    height: u32,
}

impl Rectange {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

// associated functions
impl Rectange {
    fn square(side: u32) -> Self {
        Self {
            width: side,
            height: side,
        }
    }
}

fn main() {
    let rec1 = Rectange {
        height: 10,
        width: 5,
    };
    let sq = Rectange::square(23);
    println!("the area is : {}", rec1.area());
    println!("the square is : {:#?}", sq);

}
