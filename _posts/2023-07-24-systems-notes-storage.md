---
layout: post
title: "Systems Notes: Storage"
---

# Disk I/O

Two types of I/O on disks:

1. Random
2. Sequential

Random is much slower than sequential. On HDDs, the overhead is from disk head movement. On SSDs, overhead is reduced but exists due to still needing additional page reads.

# LSM tree (log-structured merge-tree)

Tree like structure with multiple levels, used for write heavy cases, main optimization comes from sequential writes. Most commonly for key-value data.

L0 \[Memtable keys a-z\]
L1 \[SST keys a-e\], \[SST keys f-p\], \[SST keys q-z\]
L2 \[SST keys a-c\], \[SST keys d-f\], \[SST keys g-p\], \[SST keys q-t\], \[SST keys u-z\]
...
LN 

## Writes

- L0 "Memtable" stores most recently inserted data in memory
- Implemented as a sorted data structure such as self balancing tree or skip list
- Has a max size, once size is filled, the contents are flushed to disk (sequential writes).

## Flush

## SST
- Storage format for key-value pairs flushed to disk
- Two sections, Index and Segments
- Segments is organized by fixed-size blocks
- Index is sparse and contains keys and offsets for faster reads
- Can apply additional optimizations such bloom filter (faster read) and delta encoding (lower storage)

## Reads

- Looks for key until it finds it with from top to lowest level

## Compaction

- When a level has reached capacity, compaction will merge level into lower level
