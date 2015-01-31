import random

def gen_random_commands():
    f = open("random_commands.txt", "w")
    for i in range(1000):
        f.write(random.choice(["a", "b", "c", "d", "e"]))
        f.write("\n")
    f.close()

if __name__ == "__main__":
    gen_random_commands()
