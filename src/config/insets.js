import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from "react-native-safe-area-context";

const other = () => {
    const insets = useSafeAreaInsets()
  return (
    insets
  )
}

export default other

const styles = StyleSheet.create({})