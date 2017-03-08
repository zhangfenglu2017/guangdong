#!/bin/bash
if [ -z "$1" ];
then
	echo "please input parameter"
	exit
fi

if [ -z "$2" ];
then
	echo "please input parameter"
	exit
fi

if [ $# -gt 2 ]; 
then
	echo "please input 2 parameter"
	exit
fi

#pro=client
#code=sxmj
pro=$1
code=$2

path=~/Documents/pro

rm -rf ${path}/${pro}/${pro}.ccs
rm -rf ${path}/${pro}/main.js
rm -rf ${path}/${pro}/main.jsc
rm -rf ${path}/${pro}/project.json
rm -rf ${path}/${pro}/res
rm -rf ${path}/${pro}/script
rm -rf ${path}/${pro}/src
rm -rf ${path}/${pro}/cocosstudio
rm -rf ${path}/${pro}/frameworks/runtime-src/Classes/AppDelegate.h
rm -rf ${path}/${pro}/frameworks/runtime-src/Classes/AppDelegate.cpp
rm -rf ${path}/${pro}/frameworks/runtime-src/Classes/IosTools.h
rm -rf ${path}/${pro}/frameworks/runtime-src/proj.ios_mac/ios
rm -rf ${path}/${pro}/frameworks/runtime-src/proj.ios_mac/${pro}-mobile

ln -s ${path}/${code}/ccclient/mjclient.ccs   			${path}/${pro}/${pro}.ccs
ln -s ${path}/${code}/ccclient/main.jsc   	  			${path}/${pro}/main.jsc
ln -s ${path}/${code}/ccclient/project.json   			${path}/${pro}/project.json
ln -s ${path}/${code}/ccclient/res            			${path}/${pro}/res
ln -s ${path}/${code}/android/script          			${path}/${pro}/script
ln -s ${path}/${code}/ccclient/src            		    ${path}/${pro}/src
ln -s ${path}/${code}/ccclient/cocosstudio              ${path}/${pro}/cocosstudio
ln -s ${path}/${code}/ccclient/Classes/AppDelegate.h 	${path}/${pro}/frameworks/runtime-src/Classes/AppDelegate.h
ln -s ${path}/${code}/ccclient/Classes/AppDelegate.cpp  ${path}/${pro}/frameworks/runtime-src/Classes/AppDelegate.cpp
ln -s ${path}/${code}/ccclient/Classes/IosTools.h 		${path}/${pro}/frameworks/runtime-src/Classes/IosTools.h
ln -s ${path}/${code}/ios 								${path}/${pro}/frameworks/runtime-src/proj.ios_mac/ios
ln -s ${path}/${code}/${pro}-mobile 					${path}/${pro}/frameworks/runtime-src/proj.ios_mac/${pro}-mobile

echo "==== build finish  ===="