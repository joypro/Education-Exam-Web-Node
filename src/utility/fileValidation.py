import subprocess
import sys
import os

def find_mime_with_file(path):
    command = "/usr/bin/file -i {0}".format(path)
    return subprocess.Popen(command, shell=True, stdout=subprocess.PIPE).communicate()[0].split()[1]

def isValidFile(filePath):
    try:
        mineType = find_mime_with_file(filePath).decode("utf-8")
        # print("+================================>", mineType)
        # print("+================================>", mineType.find('image/jpeg'))
        if mineType.find('image/png') > -1 or mineType.find('image/jpeg') > -1 or mineType.find('image/jpg') > -1 or mineType.find('application/pdf') > -1 or mineType.find('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') > -1 or mineType.find('application/vnd.ms-excel') > -1 or mineType.find('application/zip') > -1:
           print('1')
        else:
           try:
              os.remove(filePath)
           except Exception as e:
              pass
           print('0')
    except Exception as e:
        print('0')

isValidFile(sys.argv[1])