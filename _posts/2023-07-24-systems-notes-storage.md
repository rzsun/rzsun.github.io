---
layout: post
title: "Systems Notes: Storage"
---

* TOC
{:toc}

# Disk I/O

Two types of I/O on disks:

1. Random
2. Sequential

Random is much slower than sequential. On HDDs, the overhead is from disk head movement. On SSDs, overhead is reduced but exists due to still needing additional page reads.

# LSM tree (log-structured merge-tree)

Tree like structure with multiple levels, used for write heavy cases, main optimization comes from sequential writes. Most commonly for key-value data.

```
L0 [Memtable keys a-z]
L1 [SST keys a-e] [SST keys f-p] [SST keys q-z]
L2 [SST keys a-c] [SST keys d-f] [SST keys g-p] [SST keys q-t] [SST keys u-z]
.
.
.
LN [SST] [SST] [SST] [SST] [SST] [SST] [SST] [SST] [SST] [SST] [SST] [SST] [SST] [SST] [SST] ...
```

### Writes

- L0 "Memtable" stores most recently inserted data in memory
- Implemented as a sorted data structure such as self balancing tree or skip list
- Has a max size, once size is filled, the contents are flushed to disk (sequential writes).

### SST

- Storage format for key-value pairs flushed to disk
- Two sections, Index and Segments
- Segments is organized by fixed-size blocks
- Index is sparse and contains keys and offsets for faster reads
- Can apply additional optimizations such bloom filter (faster read) and delta encoding (lower storage)

### Reads

- Looks for key until it finds it with from top to lowest level

### Compaction

- When a level has reached capacity, compaction will merge level into lower level

# Kafka

Event streaming queue that takes advantage of sequential I/O. Producers write to it and consumers read from it. Runs on JVM.

References:
- [Confluent Kafka](https://docs.confluent.io/kafka/design/index.html)
- [Apache Kafka](https://kafka.apache.org/documentation.html)
- [Original paper - stale](https://www.microsoft.com/en-us/research/wp-content/uploads/2017/09/Kafka.pdf)

## Topic

- a stream of messages of a certain type

## Broker

- design principle: "sequential disk access can in some cases be faster than random memory access!"
- filesystem used for both storing and caching
- storage: append only segment files
- caching: uses kernel pagecache (disk)
- cache to storage flush can be configured based on number of messages and duration

## Partition

- topic shard, across brokers
- guaranteed in-order reads per partition by consumer
- smallest unit of parallelism
- smallest unit of replication

### Replication

- replicated log: logs are replicated from leader to follower

### Leader Election

- Kafka dynamically maintains a set of in-sync replicas (ISR) that are caught-up to the leader
- any replica in the ISR is eligible to be elected leader

## Offset

- distance in bytes from the beginning of the log

## Producer

- client controls which partition, can implement load balancing
- send is async for batching to reduce I/O ops

## Consumer

- Consumers request messages by offset

## Consumer Group

- set of consumers that receive each message at least once
- each partition is consumed by exactly one consumer within each subscribing consumer
- one broker is group coordinator and manages offsets