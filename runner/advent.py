from glob import glob
from pathlib import Path
from re import match
from sys import path as syspath
from importlib import import_module

parent = Path(__file__).parent.parent

syspath.append(str(parent))
files = glob("day*/solve.py", root_dir=parent)


def fileSorter(file):
    return int(match(r"day(\d+)[\\\/]*solve.py", file).group(1))


files.sort(key=fileSorter)
file = files[-1]
path = file[:-3].replace("/", ".")
import_module(path)
