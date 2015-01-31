#!/bin/bash
for i in `seq 1 10`; do
    python3 gen_random_commands.py
    python3 main.py < random_commands.txt
done
