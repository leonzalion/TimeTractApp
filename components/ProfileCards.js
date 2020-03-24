import React from "react";
import {Platform, StyleSheet, Text, View} from "react-native";
import {Card, ListItem} from "react-native-elements";
import Colors from "../constants/Colors";
import formatTime from '../controllers/formatTime';
import {categoryIcons} from "../constants/CategoryIcons";
import RankColors from '../constants/RankColors';

const renderSite = (site, key) => {
  return <ListItem
    key={key}
    title={site.name}
    subtitle={formatTime(site.timeSpent)}
    leftIcon={
      React.cloneElement(
        categoryIcons[site.category],
        {
          color: RankColors[site.productivity],
          iconStyle: {width: 20},
          size: 20,
        }
      )
    }
    containerStyle={{
      margin: 0,
      padding: 2,
    }}
    pad={Platform.select({
      ios: 14,
      default: 16
    })}
  />
};

export default function ProfileCards({rescueTimeData}) {
  if (!rescueTimeData) return null;
  const {topSites, productiveTime, distractingTime} = rescueTimeData;

  return (
    <View style={styles.cardsContainer}>
      <View style={styles.timeContainer}>
        <Card
          title="Productive Time"
          titleStyle={[
            styles.cardTitle,
            {color: 'white'}
          ]}
          containerStyle={[styles.cardContainer,
            styles.timeCard,
            {marginRight: 10},
            {backgroundColor: Colors.productive}
          ]}
          dividerStyle={{
            display: 'none'
          }}
        >
          <Text style={styles.timeText}>
            {formatTime(productiveTime)}
          </Text>
        </Card>
        <Card
          title="Distracted Time"
          titleStyle={[
            styles.cardTitle,
            {color: 'white'}
          ]}
          containerStyle={[
            styles.cardContainer,
            styles.timeCard,
            {backgroundColor: Colors.distracting}
          ]}
          dividerStyle={{
            display: 'none'
          }}
        >
          <Text style={styles.timeText}>
            {formatTime(distractingTime)}
          </Text>
        </Card>
      </View>

      <Card
        title="Top Sites"
        titleStyle={styles.cardTitle}
        containerStyle={styles.cardContainer}
        dividerStyle={{
          display: 'none'
        }}
      >
        {
          console.log(topSites) ||
          topSites.map((site, index) =>
            renderSite(site, index))
        }
      </Card>
    </View>
  );
};


const styles = StyleSheet.create({
  timeContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
  },
  cardContainer: {
    margin: 0,
    marginBottom: 10,
    borderRadius: 10
  },
  cardTitle: {
    fontSize: 15
  },
  timeCard: {
    flexGrow: 1
  },
  timeText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30
  }
});
