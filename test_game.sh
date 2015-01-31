#!/bin/bash
echo "WRITING OUTPUT OF 1000 RANDOM PLAYS OF THE GAME TO output.txt"
echo "stderr prints here on the terminal, so stay tuned for stack traces"
for i in `seq 1 1000`; do
    python3 gen_random_commands.py
    python3 main.py < random_commands.txt >> output.txt
    #if [$i % 100 ]
    #  then
    #  echo "test case: "
    #fi
done
echo "DONE"
