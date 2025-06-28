import * as borsh from '@coral-xyz/borsh';

export class Movie {
  title: string;
  rating: number;
  description: string;

  constructor(title: string, rating: number, description: string) {
    this.title = title;
    this.rating = rating;
    this.description = description;
  }

  static mocks: Movie[] = [
    new Movie(
      'The Shawshank Redemption',
      5,
      `For a movie shot entirely in prison where there is no hope at all, shawshank redemption's main message and purpose is to remind us of hope, that even in the darkest places hope exists, and only needs someone to find it. Combine this message with a brilliant screenplay, lovely characters and Martin freeman, and you get a movie that can teach you a lesson every time you watch it. An all time Classic!!!`
    ),
    new Movie(
      'The Godfather',
      5,
      `One of Hollywood's greatest critical and commercial successes, The Godfather gets everything right; not only did the movie transcend expectations, it established new benchmarks for American cinema.`
    ),
    new Movie(
      'The Godfather: Part II',
      4,
      `The Godfather: Part II is a continuation of the saga of the late Italian-American crime boss, Francis Ford Coppola, and his son, Vito Corleone. The story follows the continuing saga of the Corleone family as they attempt to successfully start a new life for themselves after years of crime and corruption.`
    ),
    new Movie(
      'The Dark Knight',
      5,
      `The Dark Knight is a 2008 superhero film directed, produced, and co-written by Christopher Nolan. Batman, in his darkest hour, faces his greatest challenge yet: he must become the symbol of the opposite of the Batmanian order, the League of Shadows.`
    ),
  ];

  borshInstructionSchema = borsh.struct([
    borsh.u8('variant'),
    borsh.str('title'),
    borsh.u8('rating'),
    borsh.str('description'),
  ]);

  static borshAccountSchema = borsh.struct([
    borsh.bool('initialized'),
    borsh.u8('rating'),
    borsh.str('title'),
    borsh.str('description'),
  ]);

  serialize(): Buffer {
    try {
      const buffer = Buffer.alloc(1000); // Adjust size if needed
      this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer);
      return buffer.subarray(0, this.borshInstructionSchema.getSpan(buffer));
    } catch (e) {
      console.error('Serialization error:', e);
      return Buffer.alloc(0);
    }
  }

  static deserialize(buffer?: Buffer): Movie | null {
    if (!buffer) {
      return null;
    }

    try {
      const { title, rating, description } =
        this.borshAccountSchema.decode(buffer);
      return new Movie(title, rating, description);
    } catch (error) {
      console.error('Deserialization error:', error);
      console.error('Buffer length:', buffer.length);
      console.error('Buffer data:', buffer.toString('hex')); // Log the raw buffer data
      return null;
    }
  }
}
