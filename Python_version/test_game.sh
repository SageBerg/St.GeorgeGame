#!/bin/bash
echo ""
echo "Appending output of 1000 random plays of the game to output.txt."
echo "stderr prints here on the terminal, so stay tuned for stack traces."
echo ""
for i in `seq 1 1000`; do
    python3 gen_random_commands.py
    python3 main.py < random_commands.txt >> output.txt
    #if [$i % 100 ]
    #  then
    #  echo "test case: "
    #fi
done
echo ""
echo "done"
echo ""
